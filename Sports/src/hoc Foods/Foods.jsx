import DailyIntake from "../DailyIntake/DailyIntake"
import Search from "../Search/Search"
import Total from "../Total/Total"
import { FoodContext } from "../state/food.context"
import { useContext } from "react"
import Navigation from "../Nav/Navigation"

function Foods() {

    const {intake, setIntake} = useContext(FoodContext)

    return (
        <>
        <Navigation/>
        <Search/>
        <DailyIntake intake={intake} setIntake={setIntake}/>
        <Total intake={intake}/>
        </>
    )
}



export default Foods
