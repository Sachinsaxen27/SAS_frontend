import React from 'react'
// import QRCode from 'qrcode.react';

const Tablelist = (props) => {
    const {students,HandleQr,index,handeldownload,handeldelete,handleUpdate}=props
    // console.log(students.rollnumber)
    return (
    <>
          {/* <QRCode  value={(students.mobile)} style={{height:"10rem",width:"10rem"}} /> */}
            <td>{index+1}</td>
            <td ><img src={students.image} alt="user" style={{height:"37px",widht:'40px'}}/> </td>
            <td>{students.name}</td>
            <td>{students.email}</td>
            <td>{students.rollnumber}</td>
            <td>{students.currentedu}</td>
            <td>{students.stdbranch}</td>
            <td>{students.currentyear}</td>
            <td><i className="fa-solid fa-pen-to-square" id='imagess'style={{cursor:"pointer"}} onClick={()=>{handleUpdate(students)}}></i></td>
            <td><div><i className="fa-solid fa-trash"  id='imagess'style={{cursor:"pointer"}} onClick={()=>{return handeldelete(students._id)}} ></i></div></td>
            <td><div><i className="fa-solid fa-qrcode" style={{cursor:"pointer"}} onClick={()=>{HandleQr(students.rollnumber)}}></i></div></td>
            <td><i className="fa-solid fa-download" style={{cursor:"pointer"}} onClick={()=>{handeldownload(students)}}></i></td>
    </>
  )
}

export default Tablelist
// 