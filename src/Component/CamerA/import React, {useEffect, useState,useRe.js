import React, {useEffect, useState,useRef } from 'react';
import { QrReader } from "react-qr-reader";
import Modal from "react-modal";
import {apiUrl} from '../../config'
Modal.setAppElement("#root");
const Camera = (props) => {
  const [scanResult, setScanResult] = useState({text:"No Result"});
  const qrReaderRef = useRef(null);

  const [student, setMystudents]=useState([])
  const handleScan = (data) => {
    if (data) {
      setScanResult({text: data.text});
      if(data?.text !== 'No Result'){
        getinfo(data.text);
      }
    }
  };
  const getinfo = async (data) => {
    console.log("scanresult",data)
    try{
      const response = await fetch(`${apiUrl}api/student/findstudent/:${data}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },  
      });
      const json = await response.json()
      localStorage.setItem('data',JSON.stringify(json))
      console.log(localStorage.getItem('data'))
      setMystudents(json)
    //   console.log(json)
    }catch (error){
      console.log("error", error)
    }
  }
  const handleError = (error) => {
    console.error(error);
  };
  
//   const stopCamera = async () => {
//     // qrReaderRef.current?.stop();
//     // histroy(-1)

    // const stream = await navigator.mediaDevices.getUserMedia({
    //   audio: false,
    //   video: true,
    // });

//     stream.getTracks().forEach(function (track) {
//         track.stop();
//         track.enabled = false;
//     });
//     qrReaderRef.current.stopCamera()
//   };
  
  return (
    <>
    {/* scanResult.text === 'No Result' &&  */}
        <div style={{ height: '35rem', width: "40rem", left: "23rem", position: "absolute", overflowY: "hidden" ,top:'2rem'}}>
         <QrReader
            ref={qrReaderRef}
            onError={handleError}
            onResult={handleScan}
            style={{ width: '100%' }}
          />
        </div>
        <button>Turn Off Scanner</button>
      
      {scanResult && <p>Scan result:{JSON.stringify(scanResult.text)}</p>}
    </>
  );
};
export default Camera;
