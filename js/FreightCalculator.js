/* ------------------------------
** ----- GLOBAL VARIABLES -------
-------------------------------*/

const API_ENDPOINT = "http://207.154.255.252/api/calculateTransportCost";
let price = 0;
let dieselAddition = 0;
let total = 0;
let allErrors = [];
let uniqueErrors = null;
let sendData = {};

/* ----------------------------------------------
** ----- FUNCTION CALLED WITH HTML-BUTTON -------
-----------------------------------------------*/

function runCalc() {
  getInputData();
  clearOutputHTMLspace();
  sendAPIrequest();
}

/* ---------------------------------
** ----- PUT DATA FROM HTML- -------
** ----- INPUTS INTO OBJECT --------
----------------------------------*/

function getInputData() {
  const postcode = Number(document.getElementById("inputPostcode").value);
  const weight = Number(document.getElementById("inputWeight").value);
  const loadingMeter = Number(document.getElementById("inputLoadingMeter").value);

  if (!postcode && !weight && !loadingMeter) {
    sendData = {};
  } else if (!postcode && !weight && loadingMeter) {
    sendData = {
      loadingMeter: loadingMeter,
    };
  } else if (!postcode && weight && !loadingMeter) {
    sendData = {
      weight: weight,
    };
  } else if (!postcode && weight && loadingMeter) {
    sendData = {
      weight: weight,
      loadingMeter: loadingMeter,
    };
  } else if (postcode && !weight && !loadingMeter) {
    sendData = {
      postcode: postcode,
    };
  } else if (postcode && weight && !loadingMeter) {
    sendData = {
      postcode: postcode,
      weight: weight,
    };
  } else if (postcode && !weight && loadingMeter) {
    sendData = {
      postcode: postcode,
      loadingMeter: loadingMeter,
    };
  } else {
    sendData = {
      postcode: postcode,
      weight: weight,
      loadingMeter: loadingMeter,
    };
  }
}

/** ---------------------------------------
 * ----- CLEARING HTML TO GET READY ------- 
 * ----- FOR API OUTPUT DATA --------------
 ----------------------------------------*/

function clearOutputHTMLspace() {
  let outputArea = document.getElementById("outputArea");
  outputArea.className = "inputDiv";

  while (outputArea.firstChild) {
    outputArea.removeChild(outputArea.firstChild);
  }
}

/** ---------------------------------------------------------------
 * ----- SEND API REQUEST -----------------------------------------
 * ----- + PUT RESPONSE / ERROR DATA INTO GLOBAL VARIABLES --------
 * ----- + CALL APPLICABLE "PRINT" FUNCTION TO DISPLAY DATA -------
 * --------------------------------------------------------------*/

function sendAPIrequest() {
  axios
    .post(API_ENDPOINT, sendData)
    .then((promise) => {
      price = promise.data.price;
      dieselAddition = promise.data.dieselAddition;
      total = promise.data.total;
      printResult();
    })
    .catch((err) => {
      allErrors = [];
      if (err.response.data.errors) {
        for (let i = 0; i < Object.keys(err.response.data.errors).length; i++) {
          allErrors.push(Object.values(err.response.data.errors)[i][0]);
        }
      } else {
        allErrors[0] = err.response.data.message;
      }
      uniqueErrors = [...new Set(allErrors)];
      printErrors();
    });
}

/** -----------------------------------------
 * ----- BUILD HTML FOR RESULT DATA --------- 
 * ----- + DISPLAY HTML & DATA --------------
 ------------------------------------------*/

function printResult() {
  const outputHeader = document.createElement("h2");
  outputHeader.className = "header2";
  outputArea.appendChild(outputHeader);

  const outputForm = document.createElement("form");
  outputForm.className = "outputForm";
  outputArea.appendChild(outputForm);

  const outputPriceDiv = document.createElement("div");
  outputPriceDiv.id = "outputPrice";
  outputPriceDiv.className = "outputPair";
  const outputDieselAdditionDiv = document.createElement("div");
  outputDieselAdditionDiv.id = "outputDieselAddition";
  outputDieselAdditionDiv.className = "outputPair";
  const outputTotalDiv = document.createElement("div");
  outputTotalDiv.id = "outputTotal";
  outputTotalDiv.className = "outputPair";

  outputHeader.innerText = "Priser";

  const priceLabel = document.createElement("label");
  priceLabel.innerText = "Fraktpris:";
  priceLabel.className = "resultLabel";
  const priceValue = document.createElement("output");
  priceValue.innerText = price;
  priceValue.className = "resultValue";

  const dieselAdditionLabel = document.createElement("label");
  dieselAdditionLabel.innerText = "Dieseltillegg:";
  dieselAdditionLabel.className = "resultLabel";
  const dieselAdditionValue = document.createElement("output");
  dieselAdditionValue.innerText = dieselAddition;
  dieselAdditionValue.className = "resultValue";

  const totalLabel = document.createElement("label");
  totalLabel.innerText = "Total pris:";
  totalLabel.className = "resultLabel";
  const totalValue = document.createElement("output");
  totalValue.innerText = total;
  totalValue.className = "resultValue";

  outputForm.appendChild(outputPriceDiv);
  outputForm.appendChild(outputDieselAdditionDiv);
  outputForm.appendChild(outputTotalDiv);

  outputPriceDiv.appendChild(priceLabel);
  outputPriceDiv.appendChild(priceValue);
  outputDieselAdditionDiv.appendChild(dieselAdditionLabel);
  outputDieselAdditionDiv.appendChild(dieselAdditionValue);
  outputTotalDiv.appendChild(totalLabel);
  outputTotalDiv.appendChild(totalValue);
}

/** ----------------------------------------
 * ----- BUILD HTML FOR ERROR DATA --------- 
 * ----- + DISPLAY HTML & DATA -------------
 -----------------------------------------*/

function printErrors() {
  const outputHeader = document.createElement("h2");
  outputHeader.className = "errorHeader";
  outputHeader.innerText = "OBS!";
  outputArea.appendChild(outputHeader);

  for (let i = 0; i < uniqueErrors.length; i++) {
    const outputErrMsg = document.createElement("h3");
    outputErrMsg.id = `error_${i}`;
    outputErrMsg.className = "errorMessage";
    outputErrMsg.innerText = `${uniqueErrors[i]}`;
    outputArea.appendChild(outputErrMsg);
  }
}
