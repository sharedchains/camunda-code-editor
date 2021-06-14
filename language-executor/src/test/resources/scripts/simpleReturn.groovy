//file:noinspection
import org.camunda.spin.json.SpinJsonNode
import static org.camunda.spin.Spin.JSON
import static org.camunda.spin.Spin.*

static void main (String[] args) {
    def offeredBonds = auctionData.prop("offeredBonds").numberValue()
    return offeredBonds
}
