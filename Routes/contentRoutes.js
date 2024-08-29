const express = require("express")
const router = express.Router()

 
const {createConcept, deleteConcept, getConceptDetails, getConceptDetailsWithProgress, getAllConcepts, updateConcept} = require("../Controller/Concept");               // Course Controllers Import
const {createQuestion, updateQuestion, deleteQuestion, getAllQuestions} = require('../Controller/Question');
const { auth, isAdmin, isStudent} = require("../MiddleWare/auth")                          // Importing Middlewares
const {updateProgress } = require("../Controller/Progress");


// ********************************************************************************************************
//                                      Course routes (only by Admin)                               *
// ********************************************************************************************************
router.post("/createConcept", auth, isAdmin, createConcept)                            //Add a Concept
router.post("/updateConcept", auth, isAdmin, updateConcept)                         // Update a Concept
router.delete("/deleteConcept", auth, isAdmin, deleteConcept)                         // Delete a Concept

router.post("/createQuestion", auth, isAdmin, createQuestion)                            //Add a Question to a concept
router.post("/updateQuestion", auth, isAdmin, updateQuestion)                         // Update a Question
router.delete("/deleteQuestion", auth, isAdmin, deleteQuestion)                         // Delete a Question


router.post("/getConceptDetails", auth, getConceptDetails)
router.get("/getAllConcepts", auth, getAllConcepts)
router.get("/getAllQuestions", auth, getAllQuestions)
router.post("/getConceptDetailsWithProgress", auth, getConceptDetailsWithProgress)
router.post("/updateProgress", auth, isStudent, updateProgress);



module.exports = router
