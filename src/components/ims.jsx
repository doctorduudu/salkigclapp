import { Button, Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../index.js";
import { toast } from "material-react-toastify";
import DataTable from "react-data-table-component";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const IMS = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    costPrice: "",
    sellingPrice: "",
    // measurementUnit: "",
    quantityAvailable: "",
  });
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openEditProduct, setOpenEditProduct] = useState(false);
  const [openSellProdcts, setOpenSellProdcts] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [originalProductsArray, setOriginalProductsArray] = useState([]);
  const [productSearchValue, setproductSearchValue] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const [productsBeingSold, setProductsBeingSold] = useState({});

  useEffect(() => {
    // console.log("the component has loaded");
    let productsArray = [...productsData];

    const colRef = collection(db, "products");
    getDocs(colRef)
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          // console.log(doc.id, doc.data());
          productsArray.push(doc.data());
        });
      })
      .then(() => {
        console.log("all products obtained", productsArray);
        setProductsData(productsArray);
        setOriginalProductsArray(productsArray); //for reference to original list of products
      });
  }, []);

  const showAddProduct = () => {
    setOpenAddProduct(true);
  };
  const hideAddProduct = () => {
    setOpenAddProduct(false);
  };
  const showConfirmDelete = () => {
    setOpenConfirmDelete(true);
  };
  const hideConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };
  const showSellProducts = () => {
    let productsToSell = { ...productsBeingSold };
    const dateObj = new Date();
    for (let x = 0; x < selectedRows.length; x++) {
      let costPrice = 0;
      let profit = 0;
      let profitMargin = 0;
      costPrice = costPrice + selectedRows[x].costPrice;
      profit =
        profit + (selectedRows[x].sellingPrice - selectedRows[x].costPrice);
      profitMargin = parseFloat(
        (profitMargin + (profit / costPrice) * 100).toFixed(1)
      );
      const sale = {
        productName: selectedRows[x].name,
        productDescription: selectedRows[x].description,
        productCode: selectedRows[x].productCode,
        quantitySold: 1,
        unitPrice: selectedRows[x].sellingPrice,
        totalAmount: selectedRows[x].sellingPrice,
        profitData: {
          costPrice: costPrice,
          profit: profit,
          profitMargin: profitMargin,
        },
        extraNote: "",
        dateData: {
          year: dateObj.getFullYear(),
          month: dateObj.getMonth(),
          day: dateObj.getDate(),
          weekDay: dateObj.getDay(),
          hours: dateObj.getHours(),
          minutes: dateObj.getMinutes(),
          seconds: dateObj.getSeconds(),
          dateInMilliseconds: Date.now(),
          fullDay: `${dateObj.getDate()} ${dateObj.getMonth()} ${dateObj.getFullYear()}`,
          fullMonth: `${dateObj.getMonth()} ${dateObj.getFullYear()}`,
        },
        dateAdded: Date.now(),
      };
      console.log("sale", sale);
      productsToSell[selectedRows[x].productCode] = sale;
    }
    // console.log("products to sell", productsToSell);
    setProductsBeingSold(productsToSell);
    setOpenSellProdcts(true);
  };
  const hideSellProducts = () => {
    setOpenSellProdcts(false);
  };
  const showEditProduct = () => {
    // console.log("showing the edit product modal");
    if (selectedRows.length > 1) {
      toast.error("You can't edit multiple products");
      return;
    }
    setProduct(selectedRows[0]);
    setOpenEditProduct(true);
  };
  const hideEditProduct = () => {
    setOpenEditProduct(false);
  };

  const handleChange = ({ currentTarget: input }) => {
    // console.log(input);
    const productDetails = { ...product };
    productDetails[input.name] = input.value;
    // console.log(productDetails[input.name]);
    setProduct(productDetails);
  };

  const handleCategoriesChange = (event) => {
    const inputValue = event.target.value;
    const productDetails = { ...product };
    productDetails.category = inputValue;
    setProduct(productDetails);
  };

  const handleSelectedRowsChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  // Toggle the state so React Data Table changes to clearSelectedRows are triggered
  const handleClearSelectedDataRows = () => {
    setToggleClearRows(!toggledClearRows);
    setSelectedRows([]);
  };

  const categories = [
    {
      value: "agr",
      label: "Agriculture",
    },
    {
      value: "cap",
      label: "Carpentary",
    },
    {
      value: "elc",
      label: "Electrical",
    },
    {
      value: "gen",
      label: "General Use",
    },
    {
      value: "hse",
      label: "Household",
    },
    {
      value: "lea",
      label: "Leather",
    },
    {
      value: "mas",
      label: "Mason",
    },
    {
      value: "mch",
      label: "Machine",
    },
    {
      value: "plm",
      label: "Plumbing",
    },
    {
      value: "pnt",
      label: "Painting",
    },
  ];

  const generateProductCode = (name) => {
    const nameArray = name.toUpperCase().split(" ");
    let nameCode = "";
    for (let x = 0; x < nameArray.length; x++) {
      if (nameArray[x].length > 1) {
        const initialLetter = nameArray[x].substring(0, 1);
        if (initialLetter.toLowerCase() !== initialLetter.toUpperCase()) {
          // console.log("initial letter", initialLetter);
          nameCode = nameCode + initialLetter;
        } else {
          nameCode = nameCode + "X";
        }
      }
    }

    if (nameCode.length === 1) {
      nameCode = nameCode + "XX";
    } else if (nameCode.length === 2) {
      nameCode = nameCode + "X";
    } else if (nameCode.length > 3) {
      nameCode = nameCode.substring(0, 3);
    }

    let numberCode = "";
    for (let x = 0; x < 3; x++) {
      numberCode = numberCode + (Math.floor(Math.random() * 9) + 1);
    }
    // console.log("number code", numberCode);
    // console.log("name code", nameCode);

    const productCode = nameCode + numberCode;
    // console.log(productCode);
    return productCode;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("submitting product");

    if (!product.name) {
      toast.error("Product name must not be empty");
      return;
    } else if (!product.description) {
      toast.error("Product description must not be empty");
      return;
    } else if (!product.category) {
      toast.error("Category must not be empty");
      return;
    } else if (!product.costPrice) {
      toast.error("Cost Price must not be empty");
      return;
    } else if (!product.sellingPrice) {
      toast.error("Selling Price must not be empty");
      return;
    } else if (!product.quantityAvailable) {
      toast.error("Quantity available must not be empty");
      return;
    }

    const addProductButton = document.getElementById("submit-product-button");
    console.log(addProductButton);
    addProductButton.disabled = true;
    addProductButton.style.backgroundColor = "grey";
    // return;

    let productsArray = [...originalProductsArray];

    const categoryName = categories.filter(
      (cat) => cat.value === product.category
    )[0].label;
    // console.log(categoryName);
    const productCode = generateProductCode(product.name);

    const newProduct = {
      name: product.name,
      description: product.description,
      category: product.category,
      categoryName: categoryName,
      costPrice: Number(product.costPrice),
      sellingPrice: Number(product.sellingPrice),
      // measurementUnit: product.measurementUnit,
      quantityAvailable: Number(product.quantityAvailable),
      productCode: productCode,
    };

    // console.log("product code", productCode);
    await setDoc(doc(db, "products", productCode), newProduct).then(() => {
      productsArray.push(newProduct);
      setProductsData(productsArray);
      setOriginalProductsArray(productsArray);
      setProduct({
        name: "",
        description: "",
        category: "",
        costPrice: "",
        sellingPrice: "",
        // measurementUnit: "",
        quantityAvailable: "",
      });
      addProductButton.disabled = false;
      addProductButton.style.backgroundColor = "green";
      toast.success("Product was added successfully");
      console.log("data has been added");
    });
  };

  const productsTableColunns = [
    {
      name: <em style={{ fontWeight: "bolder" }}>CODE</em>,
      selector: (row) => row.productCode,
    },
    {
      name: <em style={{ fontWeight: "bolder" }}>NAME</em>,
      selector: (row) => row.name,
      sortable: true,
      grow: 2,
    },
    {
      name: <em style={{ fontWeight: "bolder" }}>DES</em>,
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: <em style={{ fontWeight: "bolder" }}>SP</em>,
      selector: (row) => row.sellingPrice,
      sortable: true,
    },
    {
      name: <em style={{ fontWeight: "bolder" }}>CP</em>,
      selector: (row) => row.costPrice,
      sortable: true,
    },
    {
      name: <em style={{ fontWeight: "bolder" }}>Qt</em>,
      selector: (row) => row.quantityAvailable,
    },
    {
      name: <em style={{ fontWeight: "bolder" }}>CAT</em>,
      selector: (row) => row.categoryName,
      sortable: true,
    },
  ];

  const handleProductSearchChange = ({ currentTarget: input }) => {
    // console.log(productSearchValue);
    let searchValue = input.value;
    setproductSearchValue(searchValue);

    const newProductsData = originalProductsArray.filter(
      (product) =>
        product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.productCode.toLowerCase().includes(searchValue.toLowerCase())
    );
    // console.log(newProductsData);
    setProductsData(newProductsData);
  };

  const doDeleteProduct = (e) => {
    e.preventDefault();

    if (selectedRows.length > 5) {
      toast.error("You can't delete more than 5 products at a go!");
      return;
    }

    // const deleteProductButton = document.getElementById(
    //   "delete-product-button"
    // );
    // // console.log(deleteProductButton);
    // deleteProductButton.disabled = true;
    // deleteProductButton.style.backgroundColor = "grey";
    // // return;

    setOpenConfirmDelete(false);
    console.log(selectedRows);

    console.log("deleting the selected products");
    let productsArray = [...originalProductsArray];
    console.log("original products array length", productsArray.length);

    for (let x = 0; x < selectedRows.length; x++) {
      const productIndex = productsArray.findIndex(
        (product) => product.productCode === selectedRows[x].productCode
      );
      productsArray.splice(productIndex, 1);
      deleteDoc(doc(db, "products", selectedRows[x].productCode)).then(() => {
        console.log(
          "successfully deleted data with code",
          selectedRows[x].productCode
        );

        toast.success(
          `sucessfully deleted ${selectedRows[x].name} (${selectedRows[x].description})`
        );
      });
    }

    handleClearSelectedDataRows();
    setProductsData(productsArray);
    setOriginalProductsArray(productsArray);
  };

  const doUpdateProduct = (e) => {
    e.preventDefault();
    console.log("updating the product");

    const updateProductButton = document.getElementById(
      "update-product-button"
    );
    console.log(updateProductButton);
    updateProductButton.disabled = true;
    updateProductButton.style.backgroundColor = "grey";
    // return;

    const productCode = product.productCode;
    const categoryName = categories.filter(
      (cat) => cat.value === product.category
    )[0].label;

    const newProduct = {
      name: product.name,
      description: product.description,
      category: product.category,
      categoryName: categoryName,
      costPrice: Number(product.costPrice),
      sellingPrice: Number(product.sellingPrice),
      // measurementUnit: product.measurementUnit,
      quantityAvailable: Number(product.quantityAvailable),
      productCode: productCode,
    };
    let productsArray = [...originalProductsArray];

    setDoc(doc(db, "products", productCode), newProduct).then(() => {
      productsArray.push(newProduct);
      setProductsData(productsArray);
      setOriginalProductsArray(productsArray);
      setProduct({
        name: "",
        description: "",
        category: "",
        costPrice: "",
        sellingPrice: "",
        // measurementUnit: "",
        quantityAvailable: "",
      });

      const indexOfnewProduct = productsArray.findIndex(
        (prod) => prod.productCode === newProduct.productCode
      );
      productsArray[indexOfnewProduct] = newProduct;
      setProductsData(productsArray);
      setOpenEditProduct(false);
      handleClearSelectedDataRows();
      toast.success("Product was updated successfully");
      console.log("data has been updated");
    });
  };

  const doSellProducts = (e) => {
    e.preventDefault();
    // console.log("selling the products");
    console.log("products being sold", productsBeingSold);

    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      toast.error("You must be logged in to sell");
      return;
    }

    // return;
    const confirmSoldButton = document.getElementById("confirm-sold-button");
    // console.log(confirmSoldButton);
    confirmSoldButton.disabled = true;
    confirmSoldButton.style.backgroundColor = "grey";

    for (let prod in productsBeingSold) {
      const soldProduct = productsBeingSold[prod];
      //ensuring numbers are properly saved
      soldProduct.unitPrice = Number(soldProduct.unitPrice);
      soldProduct.quantitySold = Number(soldProduct.quantitySold);
      soldProduct.soldBy = {
        email: user.email,
        id: user.uid,
        displayName: user.displayName,
      };

      const indexOfProductBeingSold = selectedRows.findIndex(
        (product) => product.productCode === soldProduct.productCode
      );
      // console.log(indexOfProductBeingSold);
      const productFirebaseId = `${soldProduct.dateAdded.toString()}_${
        indexOfProductBeingSold + 1
      }`;
      soldProduct.saleId = productFirebaseId;

      //set the total amount for each sale
      soldProduct.totalAmount =
        Number(soldProduct.quantitySold) * Number(soldProduct.unitPrice);

      const profit =
        soldProduct.totalAmount -
        soldProduct.profitData.costPrice * soldProduct.quantitySold;
      const profitMargin = parseFloat(
        (
          (profit /
            (soldProduct.profitData.costPrice * soldProduct.quantitySold)) *
          100
        ).toFixed(1)
      );
      // console.log("profit", profit);
      // console.log("profit margin", profitMargin);
      soldProduct.profitData.profit = Number(profit);
      soldProduct.profitData.profitMargin = Number(profitMargin);
      // return;

      setDoc(doc(db, "sales", productFirebaseId), soldProduct).then(() => {
        toast.success(
          `${soldProduct.productName} (${soldProduct.productDescription}) confirmed sold.`
        );
      });
    }

    setProductsBeingSold({});
    setOpenSellProdcts(false);
    handleClearSelectedDataRows();
  };

  const handleSellingProductsChange = ({ currentTarget: input }) => {
    // console.log(productsBeingSold);
    // console.log(input);

    // console.log(input.name);
    // console.log(input.value);
    const sellingProducts = { ...productsBeingSold };
    sellingProducts[input.id][input.name] = input.value;
    setProductsBeingSold(sellingProducts);
  };

  const getQuantityOfProductsSelling = (productCode) => {
    return productsBeingSold[productCode].quantitySold;
  };

  const getUnitPriceOfProductsSelling = (productCode) => {
    return productsBeingSold[productCode].unitPrice;
  };

  const getExtraNote = (productCode) => {
    return productsBeingSold[productCode].extraNote;
  };

  const getSubtTotalAmount = (productCode) => {
    const subTotal =
      Number(productsBeingSold[productCode].quantitySold) *
      Number(productsBeingSold[productCode].unitPrice);

    return subTotal;
  };

  const getTotalAmountPayable = () => {
    // console.log("products being sold", productsBeingSold);
    let totalAmountDue = 0;
    for (let prod in productsBeingSold) {
      totalAmountDue =
        totalAmountDue +
        Number(productsBeingSold[prod].quantitySold) *
          Number(productsBeingSold[prod].unitPrice);
      // console.log(totalAmountDue);
    }

    return totalAmountDue;
  };

  return (
    <div id="ims">
      <Typography component="h1" variant="h5" className="ims-header">
        INVENTORY MGT SYS.
      </Typography>

      <Grid container id="dialogs">
        <Dialog open={openAddProduct} onClose={hideAddProduct}>
          <DialogTitle>Add Product</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              {/* <DialogContentText>
              To subscribe to this website, please enter your email address
              here. We will send updates occasionally.
            </DialogContentText> */}
              <TextField
                margin="dense"
                name="name"
                label="Product Name"
                value={product.name}
                type="text"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="description"
                label="Description"
                value={product.description}
                type="text"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
              <TextField
                select
                fullWidth
                name="category"
                label="Category"
                value={product.category}
                onChange={handleCategoriesChange}
                // helperText="Please select your currency"
                variant="standard"
              >
                {categories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="dense"
                name="costPrice"
                label="Cost Price"
                value={product.costPrice}
                type="number"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="sellingPrice"
                label="Selling Price"
                value={product.sellingPrice}
                type="number"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
              {/* <TextField
                margin="dense"
                name="measurementUnit"
                label="Measurement Unit"
                value={product.measurementUnit}
                type="text"
                fullWidth
                variant="standard"
                onChange={handleChange}
              /> */}
              <TextField
                margin="dense"
                name="quantityAvailable"
                label="Quantity Available"
                value={product.quantityAvailable}
                type="number"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
            </DialogContent>
            <DialogActions>
              <Button color="secondary" size="small" onClick={hideAddProduct}>
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                id="submit-product-button"
                color="secondary"
                style={{ color: "#fff" }}
              >
                SUBMIT
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <Dialog open={openConfirmDelete} onClose={hideConfirmDelete}>
          <DialogTitle>Are you sure?</DialogTitle>
          <form onSubmit={doDeleteProduct}>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete the following{" "}
                {selectedRows.length > 1 ? "products" : "product"}?
              </DialogContentText>
              {selectedRows.map((row) => (
                <p key={row.productCode}>
                  {row.name} ({row.description}),
                </p>
              ))}
            </DialogContent>
            <DialogActions>
              <Button onClick={hideConfirmDelete}>Cancel</Button>
              <Button
                variant="contained"
                type="submit"
                id="delete-product-button"
                style={{ backgroundColor: "red" }}
              >
                Delete
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <Dialog open={openEditProduct} onClose={hideEditProduct}>
          <DialogTitle>Edit Product</DialogTitle>
          <form onSubmit={doUpdateProduct}>
            <DialogContent>
              <TextField
                margin="dense"
                name="name"
                label="Product Name"
                value={product.name}
                type="text"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="description"
                label="Description"
                value={product.description}
                type="text"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
              <TextField
                select
                fullWidth
                name="category"
                label="Category"
                value={product.category}
                onChange={handleCategoriesChange}
                variant="standard"
              >
                {categories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="dense"
                name="costPrice"
                label="Cost Price"
                value={product.costPrice}
                type="number"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="sellingPrice"
                label="Selling Price"
                value={product.sellingPrice}
                type="number"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
              {/* <TextField
                margin="dense"
                name="measurementUnit"
                label="Measurement Unit"
                value={product.measurementUnit}
                type="text"
                fullWidth
                variant="standard"
                onChange={handleChange}
              /> */}
              <TextField
                margin="dense"
                name="quantityAvailable"
                label="Quantity Available"
                value={product.quantityAvailable}
                type="number"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
            </DialogContent>
            <DialogActions>
              <Button size="small" onClick={hideEditProduct}>
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                id="update-product-button"
                style={{ backgroundColor: "green" }}
              >
                Update
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        {openSellProdcts && (
          <Dialog open={openSellProdcts} onClose={hideSellProducts}>
            <DialogTitle>Selling...</DialogTitle>
            <form onSubmit={doSellProducts}>
              <DialogContent>
                {selectedRows.map((prod) => (
                  <Grid
                    key={prod.productCode}
                    item
                    xs={12}
                    style={{ paddingBottom: "20px", marginBottom: "30px" }}
                  >
                    <Typography variant="body1" style={{ fontWeight: "bold" }}>
                      {selectedRows.findIndex(
                        (product) => product.productCode === prod.productCode
                      ) + 1}
                      . {prod.name} ({prod.description})
                    </Typography>

                    <TextField
                      margin="dense"
                      name="quantitySold"
                      label="Quantity"
                      id={prod.productCode}
                      value={getQuantityOfProductsSelling(prod.productCode)}
                      type="number"
                      fullWidth
                      variant="standard"
                      onChange={handleSellingProductsChange}
                    />
                    <TextField
                      margin="dense"
                      name="unitPrice"
                      label="Unit Price"
                      id={prod.productCode}
                      value={getUnitPriceOfProductsSelling(prod.productCode)}
                      type="number"
                      fullWidth
                      variant="standard"
                      onChange={handleSellingProductsChange}
                    />
                    <TextField
                      margin="dense"
                      name="extraNote"
                      label="Any extra note?"
                      id={prod.productCode}
                      value={getExtraNote(prod.productCode)}
                      type="text"
                      fullWidth
                      variant="standard"
                      onChange={handleSellingProductsChange}
                    />

                    {
                      <Typography variant="body1" style={{ marginTop: "8px" }}>
                        Subtotal: {getSubtTotalAmount(prod.productCode)}ghc
                      </Typography>
                    }
                  </Grid>
                ))}
                {
                  <Typography
                    variant="body1"
                    style={{ fontWeight: "bold", fontSize: "20px" }}
                  >
                    Total: {getTotalAmountPayable()}
                  </Typography>
                }
              </DialogContent>
              <DialogActions>
                <Button size="small" onClick={hideSellProducts}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  id="confirm-sold-button"
                  style={{ backgroundColor: "green" }}
                >
                  Confirm
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        )}
      </Grid>

      <Grid container id="products-table-section">
        <Grid
          item
          xs={12}
          md={6}
          className="products-search-bar"
          style={{ margin: "0 20px", maxWidth: "300px" }}
        >
          <TextField
            id="standard-search-1"
            label={
              <span>
                <SearchIcon style={{ fontSize: "14px" }} /> Search Product Name
                or Code
              </span>
            }
            type="search"
            variant="standard"
            fullWidth
            value={productSearchValue}
            onChange={handleProductSearchChange}
          />
        </Grid>
        {selectedRows.length > 0 && (
          <Grid
            container
            className="manage-selecte-rows"
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "10px 10px 0px 10px",
              padding: "10px 10px 10px 10px",
              backgroundColor: "rgb(227, 242, 253)",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "12px", fontStyle: "italic" }}>
              {selectedRows.length} {selectedRows.length > 1 ? "items" : "item"}{" "}
            </span>
            {selectedRows.length > 0 && (
              <Button
                size="small"
                variant="contained"
                onClick={showSellProducts}
                style={{
                  color: "#fff",
                  paddingLeft: "30px",
                  paddingRight: "30px",
                }}
              >
                Sell
              </Button>
            )}
            {selectedRows.length < 2 && (
              <Button
                size="small"
                variant="contained"
                style={{ background: "green" }}
                onClick={showEditProduct}
              >
                <EditIcon />
              </Button>
            )}

            {selectedRows.length > 1 && (
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={handleClearSelectedDataRows}
                style={{ color: "#fff" }}
              >
                Clear
              </Button>
            )}
            <Button
              size="small"
              variant="contained"
              style={{ background: "red" }}
              onClick={showConfirmDelete}
            >
              <DeleteIcon />
            </Button>
          </Grid>
        )}
        <Grid container className="products-table">
          <DataTable
            columns={productsTableColunns}
            data={productsData}
            pagination
            selectableRows
            onSelectedRowsChange={handleSelectedRowsChange}
            clearSelectedRows={toggledClearRows}
          />
        </Grid>
        <Fab
          size="large"
          onClick={showAddProduct}
          aria-label="add"
          className="add-product-button"
        >
          <AddIcon style={{ color: "#fff" }} />
        </Fab>
      </Grid>
    </div>
  );
};

export default IMS;
