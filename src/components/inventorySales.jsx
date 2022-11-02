import { Divider, Grid, Typography, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useState, useEffect } from "react";
import { onSnapshot, collection, doc, setDoc } from "firebase/firestore";
import { db } from "../index.js";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "material-react-toastify";

const InventorySales = () => {
  const [activeButton, setActiveButton] = useState("today");
  const [salesArray, setSalesArray] = useState([]);
  const [todaySales, setTodaySales] = useState([]);
  const [weekSales, setWeekSales] = useState([]);
  const [monthSales, setMonthSales] = useState([]);
  const [yearSales, setYearSales] = useState([]);
  const [periodSalesArray, setPeriodSalesArray] = useState([]);
  const [openEditSale, setOpenEditSale] = useState(false);
  const [saleOnEdit, setSaleOnEdit] = useState({});
  const [user, setUser] = useState({});

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setUser(currentUser);

    const dateObj = new Date();
    const today = `${dateObj.getDate()} ${dateObj.getMonth()} ${dateObj.getFullYear()}`;
    const thisMonth = `${dateObj.getMonth()} ${dateObj.getFullYear()}`;
    const thisYear = dateObj.getFullYear();

    const colRef = collection(db, "sales");
    onSnapshot(colRef, (snapshot) => {
      const sales = [];
      let salesToday = [];
      let salesThisWeek = [];
      let salesThisMonth = [];
      let salesThisYear = [];

      snapshot.docs.forEach((doc) => {
        //   console.log(doc.id, doc.data());
        const sale = doc.data();
        sale.firebaseId = doc.id;

        const todaySpecific = dateObj.getDay(); /// number of days to subtract to get first day of the week
        const todayInMilliSeconds = dateObj.getTime();

        const oneDayInMilliSeconds = 86400000;
        const monday =
          todayInMilliSeconds - (todaySpecific - 1) * oneDayInMilliSeconds;
        const tuesday = monday + oneDayInMilliSeconds;
        const wednesday = tuesday + oneDayInMilliSeconds;
        const thursday = wednesday + oneDayInMilliSeconds;
        const friday = thursday + oneDayInMilliSeconds;
        const saturday = friday + oneDayInMilliSeconds;
        const sunday = saturday + oneDayInMilliSeconds;

        const daysOfTheWeek = [
          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
          saturday,
          sunday,
        ];
        let daysOfTheWeekString = [];

        for (let x = 0; x < daysOfTheWeek.length; x++) {
          const date = new Date(daysOfTheWeek[x]);
          daysOfTheWeekString.push(
            `${date.getDate()} ${date.getMonth()} ${date.getFullYear()}`
          );
        }
        // console.log(daysOfTheWeekString);

        // console.log(daysOfTheWeek);

        // console.log(doc.data().productCode);
        // console.log(doc.data().dateData.day);
        // console.log("first day of week", sale.dateData.day - firstDayOfWeek);
        // console.log("last day of week", sale.dateData.day + lastDayOfWeek);

        if (sale.dateData.fullDay === today) {
          salesToday.push(sale);
          // console.log("today sale", sale);
        }
        if (
          // sale.dateData.day > firstDayOfWeek - 1 &&
          // sale.dateData.day < lastDayOfWeek + 1 &&
          // sale.dateData.fullMonth === thisMonth
          daysOfTheWeekString.includes(sale.dateData.fullDay)
        ) {
          // console.log("week sale", sale);

          salesThisWeek.push(sale);
        }
        if (sale.dateData.fullMonth === thisMonth) {
          // console.log("salesThisMonth", sale);
          salesThisMonth.push(sale);
        }

        if (sale.dateData.year === thisYear) {
          salesThisYear.push(sale);
        }
        sales.push(sale);
      });

      // console.log("all sales", sales);
      // console.log("sales today", salesToday);
      // console.log("sales this week", salesThisWeek);
      // console.log("sales this month", salesThisMonth);
      // console.log("sales this year", salesThisYear);
      setSalesArray(sales);
      setTodaySales(salesToday);
      setWeekSales(salesThisWeek);
      setMonthSales(salesThisMonth);
      setYearSales(salesThisYear);
      setPeriodSalesArray(salesToday); //default
    });
    // .then((snapshot) => {
    // })
    // .then(() => {
    // });
  }, []);

  const getColor = (period) => {
    if (period === activeButton) {
      return "primary";
    } else {
      return "secondary";
    }
  };

  const showPeriodSales = ({ currentTarget: button }) => {
    const salesForToday = [...todaySales];
    const salesForThisWeek = [...weekSales];
    const salesForThisMonth = [...monthSales];
    const salesForThisYear = [...yearSales];

    // console.log(button.id);
    setActiveButton(button.id);
    switch (button.id) {
      case "today":
        setPeriodSalesArray(salesForToday);
        break;
      case "week":
        setPeriodSalesArray(salesForThisWeek);
        break;
      case "month":
        setPeriodSalesArray(salesForThisMonth);
        break;
      case "year":
        setPeriodSalesArray(salesForThisYear);
        break;

      default:
        setPeriodSalesArray(salesArray);
        break;
    }
  };

  const getTotalSales = () => {
    let total = 0;
    // console.log(periodSalesArray);
    for (let x = 0; x < periodSalesArray.length; x++) {
      total = total + periodSalesArray[x].totalAmount;
    }
    // console.log(total);
    return total;
  };

  const getTotalProfit = () => {
    let profitTotal = 0;
    // console.log(periodSalesArray);
    for (let x = 0; x < periodSalesArray.length; x++) {
      profitTotal = profitTotal + periodSalesArray[x].profitData.profit;
    }
    // console.log(profitTotal);
    return profitTotal;
  };

  const getProfitMargin = () => {
    const profit = getTotalProfit();
    const sales = getTotalSales();
    const profitMargin = parseFloat((profit / sales) * 100).toFixed(1);
    return profitMargin;
  };

  const getSaleTime = (timeInMilliseconds) => {
    const dateObj = new Date(timeInMilliseconds);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const dayIndex = dateObj.getDay();
    const date = dateObj.getDate();
    const monthIndex = dateObj.getMonth();

    const getDayInWords = (index) => {
      let day = "";

      switch (index) {
        case 0:
          day = "Sun";
          break;
        case 1:
          day = "Mon";
          break;
        case 2:
          day = "Tue";
          break;
        case 3:
          day = "Wed";
          break;
        case 4:
          day = "Thu";
          break;
        case 5:
          day = "Fri";
          break;
        case 6:
          day = "Sun";
          break;
        default:
          day = "";
          break;
      }
      return day;
    };

    const getMonthInWords = (monthIndex) => {
      let month = "";
      switch (monthIndex) {
        case 0:
          month = "Jan";
          break;
        case 1:
          month = "Feb";
          break;
        case 2:
          month = "Mar";
          break;
        case 3:
          month = "Apr";
          break;
        case 4:
          month = "May";
          break;
        case 5:
          month = "Jun";
          break;
        case 6:
          month = "Jul";
          break;
        case 7:
          month = "Aug";
          break;
        case 8:
          month = "Sep";
          break;
        case 9:
          month = "Oct";
          break;
        case 10:
          month = "Nov";
          break;
        case 11:
          month = "Dec";
          break;

        default:
          month = "";
          break;
      }
      return month;
    };

    const getDateTitle = (date) => {
      if (date === 1 || date === 21 || date === 31) {
        return "st";
      } else if (date === 2 || date === 22) {
        return "nd";
      } else if (date === 3 || date === 23) {
        return "rd";
      } else {
        return "th";
      }
    };

    const dayInWords = getDayInWords(dayIndex);
    const monthInWords = getMonthInWords(monthIndex);

    if (hours > 12) {
      if (activeButton === "week") {
        return `${dayInWords}, ${hours % 12}:${minutes} pm`;
      } else if (activeButton === "month") {
        return `${date}${getDateTitle(date)}, ${hours % 12}:${minutes} pm`;
      } else if (activeButton === "year") {
        return `${monthInWords} ${date}${getDateTitle(date)}, ${
          hours % 12
        }:${minutes} pm`;
      } else {
        return `${hours % 12}:${minutes} pm`;
      }
    } else {
      if (activeButton === "week") {
        return `${dayInWords}, ${hours % 12}:${minutes} am`;
      } else if (activeButton === "month") {
        return `${date}${getDateTitle(date)}, ${hours % 12}:${minutes} am`;
      } else if (activeButton === "year") {
        return `${monthInWords} ${date}${getDateTitle(date)}, ${
          hours % 12
        }:${minutes} am`;
      } else {
        return `${hours}:${minutes} am`;
      }
    }
  };

  const showEditSale = (sale) => {
    setSaleOnEdit(sale);
    setOpenEditSale(true);
  };

  const hideEditSale = () => {
    setOpenEditSale(false);
  };

  const doEditSale = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must sign in to edit a sale");
    }

    if (!saleOnEdit.unitPrice) {
      toast.error("Please enter unit price");
      return;
    } else if (!saleOnEdit.quantitySold) {
      toast.error("Please enter quantity sold");
    }
    const saleToBeEdited = { ...saleOnEdit };
    saleToBeEdited.totalAmount = Number(getTotal());

    console.log("editing the sale", saleToBeEdited);
    saleToBeEdited.unitPrice = Number(saleOnEdit.unitPrice);
    saleToBeEdited.quantitySold = Number(saleOnEdit.quantitySold);

    const editSaleButton = document.getElementById("edit-sale-button");
    editSaleButton.disabled = true;
    editSaleButton.style.backgroundColor = "grey";

    let costPrice = saleToBeEdited.profitData.costPrice;
    const profit =
      saleToBeEdited.totalAmount - costPrice * saleToBeEdited.quantitySold;
    const profitMargin = parseFloat(
      ((profit / (costPrice * saleToBeEdited.quantitySold)) * 100).toFixed(1)
    );
    saleToBeEdited.profitData.profit = profit;
    saleToBeEdited.profitData.profitMargin = profitMargin;

    saleToBeEdited.lastEdited = {
      editedBy: user,
      timeEdited: Date.now(),
    };

    setDoc(
      doc(db, "sales", saleToBeEdited.firebaseId.toString()),
      saleToBeEdited
    ).then(() => {
      toast.success(
        "Sale was updated. Refresh if changes do not effect immediately"
      );
      editSaleButton.disabled = false;
      editSaleButton.style.backgroundColor = "green";
      setOpenEditSale(false);
      // const indexOfSaleBeingEdited = periodSalesArray.findIndex(
      //   (sale) => sale.saleId === saleToBeEdited.saleId
      // );
      // let newPeriodSalesArray = [...periodSalesArray];
      // newPeriodSalesArray[indexOfSaleBeingEdited] = saleToBeEdited;
      // setPeriodSalesArray(newPeriodSalesArray);
    });

    console.log(saleOnEdit);
  };

  const handleChange = ({ currentTarget: input }) => {
    // console.log(input);
    const saleBeingEdited = { ...saleOnEdit };
    saleBeingEdited[input.name] = input.value;
    // console.log(saleBeingEdited[input.name]);
    setSaleOnEdit(saleBeingEdited);
  };

  const getTotal = () => {
    const total =
      Number(saleOnEdit.quantitySold) * Number(saleOnEdit.unitPrice);

    return total;
  };

  return (
    <div id="inventory-sales" style={{ backgroundColor: "aliceblue" }}>
      <Grid
        container
        id="button-group"
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "10px 0",
        }}
      >
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button
            color={getColor("today")}
            className="sales-button"
            onClick={showPeriodSales}
            id="today"
          >
            Today
          </Button>
          <Button
            color={getColor("week")}
            className="sales-button"
            onClick={showPeriodSales}
            id="week"
          >
            Week
          </Button>
          <Button
            color={getColor("month")}
            className="sales-button"
            onClick={showPeriodSales}
            id="month"
          >
            Month
          </Button>
          <Button
            color={getColor("year")}
            className="sales-button"
            onClick={showPeriodSales}
            id="year"
          >
            Year
          </Button>
        </ButtonGroup>
      </Grid>

      <div id="initial-details" style={{ textAlign: "center" }}>
        <Typography variant="body1" component="p">
          {`Total Sales: ${getTotalSales()}`}{" "}
          <span
            style={{ fontWeight: "900", fontSize: "20px", color: "#a54414" }}
          >
            {" "}
            |{" "}
          </span>{" "}
          {`Profit: ${getTotalProfit()} (${getProfitMargin()}%) `}
        </Typography>

        <Grid
          container
          style={{
            padding: "20px",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          {periodSalesArray.map((sale) => (
            <Card
              key={`${sale.productCode}-${sale.dateAdded}`}
              style={{ width: "350px", marginTop: "25px", textAlign: "left" }}
            >
              <CardContent>
                <Typography style={{ fontWeight: "700" }}>
                  {periodSalesArray.findIndex(
                    (theSale) =>
                      `${theSale.productCode}-${theSale.dateAdded}` ===
                      `${sale.productCode}-${sale.dateAdded}`
                  ) + 1}
                  . {sale.productCode}: {sale.productName} (
                  {sale.productDescription})
                </Typography>
                <Divider />
                <br />
                <Typography variant="body1">
                  Quantity Sold: {sale.quantitySold}
                </Typography>
                <Typography variant="body1">
                  Unit Price: {sale.unitPrice}
                </Typography>
                <Typography variant="body1">
                  Total Amount: {sale.totalAmount}
                </Typography>
                <br />
                {sale.extraNote && (
                  <Typography variant="body2">{sale.extraNote}</Typography>
                )}
                <Button
                  variant="contained"
                  fullWidth
                  color="secondary"
                  size="small"
                  style={{ color: "#fff", marginTop: "10px" }}
                  onClick={() => showEditSale(sale)}
                >
                  Edit Sale
                </Button>
              </CardContent>
              <Divider />
              <CardActions
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {sale.soldBy && (
                  <Typography variant="caption">
                    By: {sale.soldBy.displayName}
                  </Typography>
                )}
                <Typography variant="caption">
                  {" "}
                  {getSaleTime(sale.dateData.dateInMilliseconds)}
                </Typography>
              </CardActions>
            </Card>
          ))}
          {periodSalesArray.length < 1 && (
            <Typography>There are no sales to show for this period </Typography>
          )}
        </Grid>
      </div>

      <div id="dialogs">
        <Dialog open={openEditSale} onClose={hideEditSale}>
          <DialogTitle>Edit Sale</DialogTitle>
          <form onSubmit={doEditSale}>
            <DialogContent>
              <TextField
                margin="dense"
                name="unitPrice"
                label="Unit Price"
                value={saleOnEdit.unitPrice}
                type="number"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="quantitySold"
                label="Quantity Sold"
                value={saleOnEdit.quantitySold}
                type="number"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />

              <TextField
                margin="dense"
                name="extraNote"
                label="Extra note"
                value={saleOnEdit.extraNote}
                type="text"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />

              <Typography variant="body1" style={{ marginTop: "8px" }}>
                Total: {getTotal()}ghc
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button size="small" onClick={hideEditSale}>
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                id="edit-sale-button"
                style={{ backgroundColor: "green" }}
              >
                Submit
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </div>
  );
};

export default InventorySales;
