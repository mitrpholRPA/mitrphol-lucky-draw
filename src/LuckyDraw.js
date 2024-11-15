import React, { useEffect, useState } from 'react';
import './LuckyDraw.css'; // Include the CSS for styling
import Confetti from './Confetti';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const LuckyDraw = () => {
  const [rotationDegree, setRotationDegree] = useState(0);
  const [displayText, setDisplayText] = useState("Press to Start");
  const [showConfetti, setShowConfetti] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [file, setFile] = useState(null); 
  const [listData, setListData] = useState([]);

  // useEffect(() => {
  //   // Fetch employee list from API
  //   const fetchEmployees = async () => {
  //     console.log('Initialization Apps');
  //     try {
  //       const response = await fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas');
  //       if (!response.ok) throw new Error('Network response was not ok');
  //       const data = await response.json();
  //       const names = data.map(item => item.nome);
  //       setListEmployee(names);
  //     } catch (error) {
  //       console.error("Error fetching employee list:", error);
  //     }
  //   };
  //   fetchEmployees();
  // }, []);

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

  const startSpin = () => {
    console.log("Start Spin");
    if (listData.length > 0) {
      setIsRotating(false);
      setShowConfetti(false); // Hide confetti when starting spin
      let index = 0;
      const intervalId = setInterval(() => {
          setDisplayText(listData[index % listData.length]["ชื่อ - นามสกุล"]);
          index++;
      }, 50);
      // Randow in listData
      const randomIndex = Math.floor(Math.random() * listData.length)
      // Get Row by random index
      const rowData = listData[randomIndex]
      // Map Data from json
      const {"Personal area": personal_area, "รหัสพนักงาน": employeeID, "ชื่อ - นามสกุล": fullname, "ชื่อตำแหน่ง": role, "สังกัด": dept} = rowData;
      console.log(personal_area)
      console.log(employeeID)
      console.log(fullname)
      console.log(role)
      console.log(dept)
      console.log(listData.length)

      const winnerName = fullname ;
      setListData(prevData => prevData.filter((_, index) => index !== randomIndex));
      // const winnerName = listEmployee[randomIndex];
      // setListEmployee(prev => prev.filter(item => item !== winnerName));
      console.log("WinnerName : " + winnerName);

      setTimeout(() => {
        clearInterval(intervalId);
        setDisplayText(winnerName);
        setShowConfetti(true);
        setIsRotating(true);
      }, 7000);
    }else{
      setDisplayText(" Please Upload File !")
    }
  };
  const toggleSidebar = () => {
    setIsSidebarVisible(prevState => !prevState);
  };
  // Handle the file change event
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0]; // Get the uploaded file
    if (uploadedFile) {
      setFile(uploadedFile); // Store the file in state
    }
  };
  // Handle the upload button click
  const handleUpload = () => {
    if (file) {
      // Create a FileReader to read the file content
        const reader = new FileReader();
        reader.onload = (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        // Assume the first sheet is the one we need
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        // Convert the sheet to a JSON array
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        // Store the data in the state
        setListData(jsonData);
        console.log("upload data from excel :"+jsonData.length)

      };

      reader.readAsBinaryString(file); 
      
    } else {
      alert("Please choose a file first");
    }
  };

  return (
    <div className='container'>
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarVisible ? 'show' : 'hide'}`}>
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
      </div>

      {/* Button to open Sidebar */}
      <button onClick={toggleSidebar} className="open-sidebar-btn">
        {isSidebarVisible ? <LeftOutlined /> : <RightOutlined />}
      </button>

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
        </div>
        <button onClick={startSpin} className="btnSpin">Draw</button>
      </div>
      <footer>Footer</footer>
    </div>
  );
};

export default LuckyDraw;
