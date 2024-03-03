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
    lat: Int as int32;
    lon: Int as int32;
}

struct DeliveryInfo {
    declaredSum: Int as uint64;
    courierFee: Int as uint64;

    description: String;

    from: Point;
    to: Point;
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

    deliveryInfo: DeliveryInfo;

    state: Int as uint8;

    init(deliveryInfo: DeliveryInfo) {
        self.owner = sender();
        self.deliveryInfo = deliveryInfo;
        self.state = StateCreated;
    }

    // increment
    // starts this SC delivery offer
    receive("start") {
        require(sender() == self.owner, "Only owner can start this SC");
        require(self.state == StateCreated, "SC must be in state 'Created'");
        require(myBalance() >= self.deliveryInfo.declaredSum + self.deliveryInfo.courierFee + OperationFee, "Not enough money on balance to start");

        self.state = StatePayed;
    }

    // increment
    // accepts this SC delivery offer
    receive("accept") {
        require(context().value >= self.deliveryInfo.declaredSum + CourierCancellationPenalty + OperationFee, "Less then required for accepting");
        require(self.state == StatePayed, "SC must be in state 'Payed' before it can be accepted ");

        self.courier = sender();
        self.state = StateFoundCourier;
    }

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

        if (self.courier != null) {
            send(
                SendParameters{
                    to: self.courier!!,
                    bounce: false,
                    value: self.DeliveryInfo.courierFee+self.deliveryInfo,
                    mode: SendIgnoreErrors
            });
        }

        self.reply("done".asComment());
    }

    // cancels this SC delivery offer
    // depending on whom it was canceled by
    // fee will be payed
    receive("cancel") {

    }

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
}
