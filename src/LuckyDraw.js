import React, { useEffect, useState } from 'react';
import './LuckyDraw.css'; // Include the CSS for styling
import Confetti from './Confetti';
// import { RightOutlined, LeftOutlined } from '@ant-design/icons';
// import * as XLSX from 'xlsx';

const LuckyDraw = () => {
  const [rotationDegree, setRotationDegree] = useState(0);
  const [displayText, setDisplayText] = useState("Press to Start");
  const [dept,setDept] =useState()
  const [showConfetti, setShowConfetti] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  // const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  // const [file, setFile] = useState(null); 
  const [listData, setListData] = useState([]);

  useEffect(() => {
    // Fetch employee list from API
    const fetchEmployees = async () => {
      console.log('Initialization Apps');
      try {
        const api = process.env.REACT_APP_API+'/api/v1/getEmployee'
        const response = await fetch(api,{
          method : 'POST',
          headers: {'Content-Type': 'application/json' }
        });
        
        if (response.ok){
          const data = await response.json();
          console.log(data)
          setListData(data)
        }else{
          const data = await response.json();
          console.log(data)
        }
        // setListEmployee(names);
      } catch (error) { 
        console.error("Error fetching employee list:", error);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    // Rotate the wheel when isRotating state is true
    let interval;
    if (isRotating) {
      interval = setInterval(() => {
        setRotationDegree(prevDegree => prevDegree + 5); // Increase rotation degree
      }, 100);
    } else {
      setRotationDegree(0); // Reset rotation when it's stopped
    }
    return () => clearInterval(interval); // Cleanup interval when not rotating
  }, [isRotating]);


  const updateEmployeeID = async(emailAddress) =>{
    const api = process.env.REACT_APP_API+'/api/v1/drawEvent'
    const requestData = { email: emailAddress };
    const response = await fetch(api,{
      method : 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });
    const data = await response.json();
    console.log(data)
  }
  const startSpin = () => {
    // Clear Current Display Department 
    setDept("")
    if (listData.length > 0) {
      setIsRotating(false);
      setShowConfetti(false); // Hide confetti when starting spin
      let index = 0;
      const intervalId = setInterval(() => {
          setDisplayText(listData[index % listData.length]["name"]);
          index++;
      }, 50);
      // Randow in listData
      const randomIndex = Math.floor(Math.random() * listData.length)
      console.log(randomIndex)
      // Get Row by random index
      const rowData = listData[randomIndex]
      console.log(rowData)
      // Map Data from json
      const {"department": personal_area,"email": emailAddress ,"name": fullname} = rowData;
      const winnerName = fullname ;

      setListData(prevData => prevData.filter((_, index) => index !== randomIndex));
      setTimeout(() => {
        clearInterval(intervalId);
        setDisplayText(winnerName);
        setShowConfetti(true);
        setIsRotating(true);
        setDept(personal_area)
      }, 4000);
      // show Department after spinner
      updateEmployeeID(emailAddress)
    }else{
      setDisplayText(" Please Check Database!")
    }
  };


  // const toggleSidebar = () => {
  //   setIsSidebarVisible(prevState => !prevState);
  // };
  // Handle the file change event
  // const handleFileChange = (event) => {
  //   const uploadedFile = event.target.files[0]; // Get the uploaded file
  //   if (uploadedFile) {
  //     setFile(uploadedFile); // Store the file in state
  //   }
  // };
  // Handle the upload button click
  // const handleUpload = () => {
  //   if (file) {
  //     // Create a FileReader to read the file content
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //       const binaryStr = e.target.result;
  //       const workbook = XLSX.read(binaryStr, { type: 'binary' });
  //       // Assume the first sheet is the one we need
  //       const sheet = workbook.Sheets[workbook.SheetNames[0]];
  //       // Convert the sheet to a JSON array
  //       const jsonData = XLSX.utils.sheet_to_json(sheet);
  //       // Store the data in the state
  //       setListData(jsonData);
  //       console.log("upload data from excel :"+jsonData.length)
  //     };

  //     reader.readAsBinaryString(file); 
      
  //   } else {
  //     alert("Please choose a file first");
  //   }
  // };

  return (
    <div className='container'>
      {/* Sidebar */}
      {/* <div className={`sidebar ${isSidebarVisible ? 'show' : 'hide'}`}>
        <p>Upload File Employee</p>
        <label htmlFor="chooseFile" className="custom-file-upload">
          Choose File
        </label>
        <input
          type="file"
          id="chooseFile"
          accept=".xlsx"
          name="chooseFile"
          className="file-input"
          onChange={handleFileChange}
        />
        <button className="upload-btn" onClick={handleUpload}>Upload</button>
        <h5>จำนวนพนักงาน {listData.length} คน</h5>
      </div> */}

      {/* Button to open Sidebar */}
      {/* <button onClick={toggleSidebar} className="open-sidebar-btn">
        {isSidebarVisible ? <LeftOutlined /> : <RightOutlined />}
      </button> */}

      {/* Confetti */}
      {showConfetti && <Confetti Btn={showConfetti} setBtn={setShowConfetti} />}

      <div className="sunburst-container" style={{ position: 'relative', width: '100%', height: '100vh' }}>
        {isRotating ? (
          <img
            src="sun1.png"
            alt="Sunburst"
            style={{
              width: '100%',
              height: 'auto',
              transform: `rotate(${rotationDegree}deg)`,
              transition: 'transform 0.1s linear',
            }}
            className="sunburst-image"
          />
        ) : null}

        <div className="winner-textbox">
          <p className="title-winner">Winner</p>
          <p>{displayText}</p>
          <p>{dept}</p>
        </div>
        <button onClick={startSpin} className="btnSpin">Draw</button>
      </div>
      <footer>Footer</footer>
    </div>
  );
};

export default LuckyDraw;
