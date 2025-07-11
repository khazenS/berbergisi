import { Container, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  changeStatus,
  defineStatus,
} from "../../redux/features/adminPageSlices/shopStatusSlice";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import Clock from "../mainPage/Clock.js";
import StoreIcon from "@mui/icons-material/Store";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AdminFirstPart() {
  const dispatch = useDispatch();
  const shopStatusState = useSelector((state) => state.shopStatus);
  const navigate = useNavigate();
  // These for confirmation before change shop status
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  // defining the first value of shopStatusState.status
  useEffect(() => {
    dispatch(defineStatus());
  }, [dispatch]);

  useEffect(() => {
    if (shopStatusState.expiredError === true) {
      navigate("/adminLogin");
    }
  }, [shopStatusState.expiredError, navigate]);

  // Confirmation Functions
  const handleOpenConfirmModal = (status) => {
    setPendingStatus(status);
    setOpenConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setOpenConfirmModal(false);
    setPendingStatus(null);
  };
  //Button Click Fucntion
  const changeProcessFunc = (status) => {
    dispatch(changeStatus(status));
    setOpenConfirmModal(false);
  };

  //Logout button click function
  const handleLogoutButton = () => {
    localStorage.removeItem("adminAccessToken");
    navigate("/adminLogin");
  };

  if (shopStatusState.defineRequest.isLoading === true) {
    return (
      <Container sx={{ display: "flex", height: "10vh" }}>
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
      </Container>
    );
  } else {
    if (shopStatusState.defineRequest.error === true) {
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
    } else if (shopStatusState.status !== null) {
      return (
        <Container sx={{ display: "flex", flexDirection: "column" }}>
          <Button
            variant="contained"
            color="error"
            sx={{ fontWeight: "bold" }}
            onClick={() => {
              handleLogoutButton();
            }}
          >
            Çıkış Yap
          </Button>
          <Button
            startIcon={<StoreIcon />}
            variant="contained"
            color={shopStatusState.status ? "error" : "success"}
            size="large"
            sx={{ fontWeight: "bold", marginTop: 4 }}
            onClick={() => {
              handleOpenConfirmModal(shopStatusState.status);
            }}
          >
            Dükkanı {shopStatusState.status === true ? "kapat" : "aç"}
          </Button>
          <Dialog
            open={openConfirmModal}
            onClose={handleCloseConfirmModal}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
          >
            <DialogTitle id="confirm-dialog-title">Onay Gerekli</DialogTitle>
            <DialogContent>
              <DialogContentText
                id="confirm-dialog-description"
                sx={{ fontWeight: "bold" }}
              >
                Bu işlemi yapmak istediğinizden emin misiniz?
              </DialogContentText>
            </DialogContent>
            <DialogActions
              sx={{ justifyContent: "space-between", padding: "16px" }}
            >
              <Button
                onClick={handleCloseConfirmModal}
                color="error"
                variant="contained"
                sx={{ fontWeight: "bold" }}
              >
                İptal
              </Button>
              <Button
                onClick={() => changeProcessFunc(pendingStatus)}
                color="success"
                variant="contained"
                sx={{ fontWeight: "bold" }}
                autoFocus
              >
                Onayla
              </Button>
            </DialogActions>
          </Dialog>
          <Clock />
        </Container>
      );
    }
  }
}
