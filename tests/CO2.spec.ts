import {Blockchain, SandboxContract, TreasuryContract} from '@ton/sandbox';
import {toNano} from '@ton/core';
import {CO2} from '../wrappers/CO2';
import '@ton/test-utils';
import {DeliveryInfo, Point} from "../build/CO2/tact_CO2";

describe('CO2', () => {
    let blockchain: Blockchain;
    let service: SandboxContract<TreasuryContract>
    let owner: SandboxContract<TreasuryContract>;
    let courier: SandboxContract<TreasuryContract>;
    let contract: SandboxContract<CO2>;

    const globalDeclaredSum = 100;
    const globalCourierFee = 10;

    const transactionFeeN = 43115000n

    const globalFrom = {
        lat: BigInt(59925399),
        lon: BigInt(30321155),
    } as Point;

    const globalTo = {
        lat: BigInt(59936688),
        lon: BigInt(30322102),
    } as Point;

    const globalDescription = 'MacBook air 13.8. Code to receive 567890. When get to delivery point knock on door and get to 3rd floor. Don\'t Forget the id';

    const StateCreated = 1n;
    const StatePayed = 2n;
    const StateFoundCourier = 3n;
    const StatePickedUp = 4n;
    const StateDelivered = 5n;
    const StateCanceledByOwner = 6n;
    const StateCanceledByCourier = 7n;

    const CourierCancellationPenalty = 10000n;
    const OperationFee = 100n;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        owner = await blockchain.treasury('owner');
        courier = await blockchain.treasury('courier', {balance: transactionFeeN+toNano(globalCourierFee+globalDeclaredSum)})
        service = await blockchain.treasury('service')
    });

    const createContract = async ({declaredSum, courierFee, description, from, to}: DeliveryInfo) => {
        declaredSum = declaredSum ?? globalDeclaredSum
        courierFee = courierFee ?? globalCourierFee

        description = description ?? globalDescription

        from = from ?? globalFrom
        to = to ?? globalTo

        contract = blockchain.openContract(
            await CO2.fromInit(
                {
                    $$type: 'DeliveryInfo',
                    name: 'some name',
                    declaredSum: toNano(declaredSum),
                    courierFee: toNano(courierFee),
                    description: description,
                    from: {
                        $$type: 'Point',
                        lat: from.lat,
                        lon: from.lon,
                    },
                    to: {
                        $$type: 'Point',
                        lat: to.lat,
                        lon: to.lon,
                    },
                }));
    }

    const deploy = async () => {
        const ownerBalanceBefore = await owner.getBalance()
        const courierBalanceBefore = await courier.getBalance()

        const deploySum = toNano((globalDeclaredSum + globalCourierFee + 0.2) * 2)

        const res = await contract.send(
            owner.getSender(),
            {
                value: deploySum,
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(res.transactions).toHaveTransaction({
            from: owner.address,
            to: contract.address,
            value: deploySum,
            deploy: true,
            success: true,
        });

        const ownerBalanceAfter = await owner.getBalance()

        expect(ownerBalanceBefore - ownerBalanceAfter).toBeGreaterThanOrEqual(transactionFeeN)
        expect(await contract.getBalance()).toEqual(0n)
    }


    const start = async () => {
        const startSum = toNano(globalDeclaredSum + globalCourierFee + 0.1)
        const res = await contract.send(
            owner.getSender(),
            {
                value: startSum,
            },
            "start",
        )

        expect(res.transactions).toHaveTransaction({
            from: owner.address,
            to: contract.address,
            value: startSum,
            success: true
        })
    }

    const accept = async () => {
        const courierCashIn = toNano(globalDeclaredSum) + CourierCancellationPenalty + OperationFee
        const res = await contract.send(
            courier.getSender(),
            {
                value: courierCashIn,
            },
            "accept",
        )

        expect(res.transactions).toHaveTransaction({
            from: courier.address,
            to: contract.address,
            value: courierCashIn,
            success: true
        })
    }
    const pickup = async () => {
        const res = await contract.send(
            courier.getSender(),
            {
                value: transactionFeeN,
            },
            "pickup",
        )

        expect(res.transactions).toHaveTransaction({
            from: courier.address,
            to: contract.address,
            value: transactionFeeN,
            success: true
        })
    }
    const deliver = async () => {
        const res = await contract.send(
            owner.getSender(),
            {
                value: transactionFeeN,
            },
            "commit_delivery",
        )

        expect(res.transactions).toHaveTransaction({
            from: owner.address,
            to: contract.address,
            value: transactionFeeN,
            success: true
        })
    }

    it('🟢OK right flow', async () => {
        // deploy
        await createContract({} as DeliveryInfo)

        const ownerBalanceBefore = await owner.getBalance();
        const courierBalanceBefore = await courier.getBalance();

        await deploy()

        expect(await contract.getBalance()).toEqual(0n)
        expect(await contract.getState()).toEqual(StateCreated)

        const bb = await contract.getDeliveryInfo()

        expect(bb.description).toEqual(globalDescription)

        expect(bb.declaredSum).toEqual(toNano(globalDeclaredSum))
        expect(bb.courierFee).toEqual(toNano(globalCourierFee))

        expect(bb.to.lat).toEqual(globalTo.lat)
        expect(bb.to.lon).toEqual(globalTo.lon)

        expect(bb.from.lat).toEqual(globalFrom.lat)
        expect(bb.from.lon).toEqual(globalFrom.lon)

        // start contract
        await start()

        expect(await contract.getBalance()).toBeGreaterThanOrEqual(toNano(globalDeclaredSum + globalCourierFee))
        expect(await contract.getState()).toEqual(StatePayed)
        // accept order
        expect(await contract.getCourier()).toEqual(null)

        await accept()

        // @ts-ignore
        expect((await contract.getCourier()).toString()).toEqual(courier.address.toString())
        expect(await contract.getState()).toEqual(StateFoundCourier)

        // PickUp
        await pickup()
        expect(await contract.getState()).toEqual(StatePickedUp)

        const cv = await contract.getBalance()

        // Commit delivery
        await deliver()


        const ownerBalanceDiff = ownerBalanceBefore - await owner.getBalance();
        const courierBalanceAfter = await courier.getBalance() - courierBalanceBefore;

        console.log()

    });
});
