import "@stdlib/deploy";
import "@stdlib/ownable";

// Geological point
// lat and long are multiplied by 10^6 values
// this means that for original
//      lat = 59.957435
//      lon = 30.308097
// you will write
//      lat = 59957435
//      lon = 30308097
struct Point {
    lat: Int as int64;
    lon: Int as int64;
}

struct DeliveryInfo {
    declaredSum: Int as uint64;
    courierFee: Int as uint64;

    name: String;
    description: String;

    from: Point;
    to: Point;
}

struct TotalInfo {
    short: DeliveryInfo;
    owner: Address;
    courier: Address? = null;
    state: Int as uint8;
}

const StateCreated: Int = 1;
const StatePayed: Int = 2;
const StateFoundCourier: Int = 3;
const StatePickedUp: Int = 4;
const StateDelivered: Int = 5;
const StateCanceledByOwner: Int = 6;
const StateCanceledByCourier: Int = 7;

const CourierCancellationPenalty: Int = 10000;
const OperationFee: Int = 100;

contract CO2 with Deployable, Ownable {
    owner: Address;
    courier: Address?;

    createdAt: Int;

    deliveryInfo: DeliveryInfo;

    state: Int as uint8;

    init(deliveryInfo: DeliveryInfo) {
        self.owner = sender();
        self.deliveryInfo = deliveryInfo;
        self.state = StateCreated;
        self.createdAt = now();

        require(deliveryInfo.name != "", "Name must be filled");
        require(deliveryInfo.description != "", "Description must be filled");
    }

    // starts this SC delivery offer by owner
    receive("start") {
        require(self.state == StateCreated, "SC must be in state 'Created'");
        require(sender() == self.owner, "Only owner can start this SC");

        self.state = StatePayed;

        require(myBalance() >= self.deliveryInfo.courierFee, "Not enough money on balance to start");
    }

    // Courier agreed to deliver
    receive("accept") {
        require(self.state == StatePayed, "SC must be in state 'Payed' before it can be accepted ");

        self.courier = sender();
        self.state = StateFoundCourier;

        require(context().value >= self.deliveryInfo.declaredSum + CourierCancellationPenalty, "Less then required for accepting");
    }

    // Courier picked up a package
    receive("pickup") {
        require(sender() == self.courier, "Only courier can send 'pickup' message");
        require(self.state == StateFoundCourier, "SC must be in state 'FoundCourier' in order to change state to 'PickedUp'");

        self.state = StatePickedUp;
    }

    // Commitment by owner on successful delivery
    receive("commit_delivery") {
        require(sender() == self.owner, "Only owner of contract can commit delivery");
        require(self.state == StatePickedUp, "Before commit delivery SC must be in 'PickedUp' state");

        require(self.courier != null, "No courier");

        self.state = StateDelivered;

        send(
        SendParameters{
            to: self.courier!!,
            bounce: false,
            value: self.deliveryInfo.courierFee+self.deliveryInfo.declaredSum,
            mode: SendIgnoreErrors
        }
        );

        send(
        SendParameters{
            to: sender(),
            bounce: true,
            value: 0,
            mode: SendRemainingBalance + SendIgnoreErrors
        });
    }

    // cancels this SC delivery offer
    // depending on whom it was canceled by
    // fee will be payed
    receive("cancel") {}

    get fun deliveryInfo(): DeliveryInfo {
        return self.deliveryInfo;
    }

    get fun balance(): Int {
        return myBalance();
    }

    get fun state(): Int {
        return self.state;
    }

    get fun courier(): Address? {
        return self.courier;
    }

    get fun totalInfo(): TotalInfo {
        return TotalInfo{
        short: self.deliveryInfo,
        owner: self.owner,
        courier: self.courier,
        state: self.state
        };
    }
}
