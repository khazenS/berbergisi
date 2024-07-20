import InfoBoxes from "./InfoBoxes"
import LineTable from "./LineTable"
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";


function QueueInformation(){

    return (
        <div>
            <InfoBoxes></InfoBoxes>
            <LineTable></LineTable>            
        </div>

    )
}

export default QueueInformation