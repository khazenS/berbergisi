import { useEffect } from "react";
import LineTable from "./LineTable.js";
import { useDispatch, useSelector } from "react-redux";
import { defineStatus } from "../../../redux/features/adminPageSlices/shopStatusSlice";
import InfoBoxes from "./InfoBoxes.js";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function Body() {
  const dispatch = useDispatch();
  const shopStatusState = useSelector((state) => state.shopStatus);
  const firstPageState = useSelector(state => state.shopStatus.status);
  const secondPageState = useSelector(state => state.shopStatus.status);
  useEffect(() => {
    dispatch(defineStatus());
  }, [dispatch]);

  useEffect(() => {
    console.log("değişti: ",firstPageState)
  }, [firstPageState]);


  if (shopStatusState.defineRequest.isLoading === true || shopStatusState.defineRequest.isLoading === null) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  } else if (shopStatusState.defineRequest.error)
    return (
      <div>
        <Stack
          sx={{
            height: "50vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Alert variant="filled" severity="error">
            Yüklenirken bir hata oluştu lütfen sayfayı yenileyiniz.
          </Alert>
        </Stack>
      </div>
    );
  else {
    return (
      <div>
        {shopStatusState.status ? (
          <>
            <InfoBoxes />
            <LineTable />
          </>
        ) : (
          <div>Kapali</div>
        )}
      </div>
    );
  }
}

export default Body;
