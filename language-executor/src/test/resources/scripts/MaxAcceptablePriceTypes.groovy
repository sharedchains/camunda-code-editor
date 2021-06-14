//file:noinspection
import org.camunda.spin.json.SpinJsonNode
import static org.camunda.spin.Spin.JSON
import static org.camunda.spin.Spin.*

// DEFINITIONS:
// MAP = Max Acceptable Price, not map variable type
// WAP = Weighted Average Price

// main returns the maximum acceptable price
static void main (String[] args) {

    // get variables from JSON
    def offers = offersJson.prop("requestsArray").elements()
    Number offeredBonds = auctionData.prop("offeredBonds").numberValue()
    double discountMAP = auctionData.prop("discountMAP").numberValue() / 10000

    SpinJsonNode copyArray = JSON("{\"root\": [{}]}")
    Number bondsCounter1 = 0
    Number bondsCounter2 = 0
    int sum = 0
    boolean firstElement = true
    int j = 0
    int i;

    SpinJsonNode row = JSON("{}")

    // copy second half elements to copyArray
    for(i=0; i<offers.size(); i++) {
        // def j = 0
        bondsCounter1 = bondsCounter1 + offers[i].prop("bondsNum").numberValue()
        if (bondsCounter1 >= offeredBonds/2) {
            if (bondsCounter2 < offeredBonds/2) {
                if (firstElement == true) {
                    copyArray.prop("root").elements()[0].prop("operator", offers[i].prop("operator").stringValue())
                    copyArray.prop("root").elements()[0].prop("requestNum", offers[i].prop("requestNum").numberValue())
                    copyArray.prop("root").elements()[0].prop("bondsNum", offers[i].prop("bondsNum").numberValue())
                    copyArray.prop("root").elements()[0].prop("price", offers[i].prop("price").numberValue())

                    // change last element's 'bondsNum' to arrive at half of offered bonds
                    copyArray.prop("root").elements()[0].prop("bondsNum", bondsCounter1 - offeredBonds/2)
                    bondsCounter2 = copyArray.prop("root").elements()[0].prop("bondsNum").numberValue()
                    j++
                    firstElement = false
                }
                else {
                    // "copyArray = copyArray + offers[i]"
                    row = JSON("{}")
                    row.prop("operator", offers[i].prop("operator").stringValue())
                    row.prop("requestNum", offers[i].prop("requestNum").numberValue())
                    row.prop("bondsNum", offers[i].prop("bondsNum").numberValue())
                    row.prop("price", offers[i].prop("price").numberValue())
                    copyArray.prop("root").append(row)
                    // increase copyArray's counter of 'bondsNum'
                    bondsCounter2 = bondsCounter2 + offers[i].prop("bondsNum").numberValue()
                    j++
                    if (bondsCounter2 > offeredBonds/2) {
                        // change last element's 'bondsNum' to arrive at half of offered bonds
                        def bondsNumFinal = offers[i].prop("bondsNum").numberValue() - (bondsCounter2 - offeredBonds/2)
                        def k = j - 1
                        copyArray.prop("root").elements()[k].prop("bondsNum", bondsNumFinal)
                    }
                }
            }
            else {
                // break out of loop if the counter if we exceeded half of offered bonds
                break
            }
        }
    }

    // calculate sum for weighted average
    for(i=0; i<copyArray.prop("root").elements().size(); i++) {
        sum = sum + copyArray.prop("root").elements()[i].prop("bondsNum").numberValue() * copyArray.prop("root").elements()[i].prop("price").numberValue()
    }

    double WAP = calcWAP(sum, offeredBonds/2)
    double yield = priceToYield(WAP) - discountMAP
    double MAP = yieldToPrice(yield)

    // $$$ PRINTO ENTRAMBI
    println("********copyArray (map11)--> "+copyArray)
    println("********offersJson (map11)--> "+offersJson)
    return MAP
    // return copyArray;

}

// HELPER FUNCTIONS:

// calculates the yield of a bond given a price
static double priceToYield (double price) {
    return (100 - price) / price
}

// calculates the price of a bond given a yield
static double yieldToPrice (double yield) {
    return 100 / (1 + yield)
}

// calculates weighted average price of the second half by taking the product sum and the total number of bonds offered
static double calcWAP (int sum, BigDecimal totNumber) {
    return (sum / totNumber)
}