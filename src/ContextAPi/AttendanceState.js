import React, { useState } from 'react'
import AttendancenSApi from "./AttendanceSApi";

import userlogin from '../Component/image/user.png'
import dduser from '../Component/image/dduser.png'
import icimages from '../Component/image/icons8-handwritten-ocr-100.png'
import DNavimage from '../Component/image/icons8-handwritten.png'
const AttendanceState = (props) => {

  const [bgcolor, setMybgColor] = useState('light')
  const [dbgcolor, setMydbgcolor] = useState('info')
  const [fgcolor, setMyfgColor] = useState('dark')
  const [images, setImage] = useState(userlogin)
  const [darkimg, setMydarkimg] = useState({ text: "fa-solid fa-moon fa-xl", type: "#145fe1" })
  const [butn, setMybtun] = useState('white')
  const [Navimage, setMyNavimage] = useState(icimages)
  const ModeChange = () => {
    if (bgcolor === 'light') {
      setMybgColor('dark')
      setMydbgcolor('primary')
      setMyfgColor('white')
      setImage(dduser)
      setMydarkimg({ text: "fa-sharp fa-solid fa-sun fa-xl", type: "#fbff1a" })
      setMybtun('grey')
      setMyNavimage(DNavimage)
      document.body.style.background =
        'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)'
      document.body.style.backgroundAttachment = 'fixed'
    }
    else {
      setMybgColor('light')
      setMyNavimage(icimages)
      setMydbgcolor('info')
      setMyfgColor('dark')
      setMybtun("white")
      setImage(userlogin)
      setMydarkimg({ text: "fa-solid fa-moon fa-xl", type: "#145fe1" })
      // document.body.style.backgroundColor = "white"
      document.body.style.background = "white"
      document.body.style.backgroundAttachment = "scroll"
      // document.body.style.background =
      //   'linear-gradient(135deg, #eef2ff 0%, #e0f2fe 100%)'
      // document.body.style.backgroundAttachment = 'fixed'
    }
  }
  const [alert, setMyAlert] = useState({ msg: null, type: null })
  const showAlert = (message, type) => {
    setMyAlert({ msg: message, type: type })
    setTimeout(() => {
      setMyAlert({ msg: null, type: null })
    }, 2000)
  }


  return (
    <>
      <AttendancenSApi.Provider value={{ ModeChange, bgcolor, Navimage, fgcolor, dbgcolor, images, alert, darkimg, showAlert, butn }}>
        {props.children}
      </AttendancenSApi.Provider>
    </>
  )
}

export default AttendanceState
