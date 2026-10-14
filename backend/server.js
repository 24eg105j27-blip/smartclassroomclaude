import express from "express";
import cors from "cors";
import fs from "fs";
const app = express();
app.use(cors());
app.use(express.json());
const CLASS_FILE = "./backend/data/classrooms.json";
const RES_FILE = "./backend/data/reservations.json";
const getClassrooms = () => JSON.parse(fs.readFileSync(CLASS_FILE, "utf-8"));
const getReservations = () => JSON.parse(fs.readFileSync(RES_FILE, "utf-8"));
const saveReservations = (data) => fs.writeFileSync(RES_FILE, JSON.stringify(data, null, 2));

app.get("/api/classrooms", (req,res)=>{
  let rooms = getClassrooms();
  let reservations = getReservations();
  let now = new Date();
  rooms = rooms.map(r=>{
    let hasActive = reservations.find(x=> x.classroomId===r.id && new Date(x.endTime) > now && new Date(x.startTime) <= now && x.status==="Approved");
    if(hasActive){ r.status="Occupied"; r.nextFree = new Date(hasActive.endTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); }
    else { r.status="Available"; r.nextFree="Now"; }
    return r;
  });
  res.json(rooms);
});

app.get("/api/reservations", (req,res)=>{ res.json(getReservations()); });

app.post("/api/reserve", (req,res)=>{
  const { classroomId, facultyName, purpose, startTime, endTime } = req.body;
  let reservations = getReservations();
  let conflict = reservations.find(r=> r.classroomId===classroomId && r.status==="Approved" && (new Date(startTime) < new Date(r.endTime) && new Date(endTime) > new Date(r.startTime)));
  if(conflict) return res.status(400).json({message:"Room already booked at this time!"});
  let newRes = { id: "RES-"+Date.now(), classroomId, facultyName, purpose, startTime, endTime, status:"Approved", createdAt: new Date().toISOString() };
  reservations.push(newRes);
  saveReservations(reservations);
  res.json({message:"Booked Successfully!", reservation:newRes});
});

app.delete("/api/reservations/:id", (req,res)=>{
  let reservations = getReservations();
  reservations = reservations.filter(r=> r.id !== req.params.id);
  saveReservations(reservations);
  res.json({message:"Cancelled"});
});

app.get("/", (req,res)=> res.send("Smart Classroom Backend Running"));

app.listen(5000, ()=> console.log("Backend running on http://localhost:5000"));
