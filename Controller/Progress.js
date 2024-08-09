const Question = require("../Model/Question")
const Progress = require("../Model/Progress")
const User = require("../Model/User")

exports.updateProgress = async (req, res) => {

  const { conceptId, questionId } = req.body
  const userId = req.user.id

  try {                                       
    const question = await Question.findById(questionId)
    if(!question) {
      return res.status(404).json({ error: "Invalid question" })
    }

    // Find the  progress document for the user and concept
    let progress = await Progress.findOne({conceptId: conceptId,  userId: userId, })
    
    if(!progress){                                                
      let user = await User.findOne({_id:userId});
      
      if(!user){
        return res.status(400).json({ message: "user not found" })

      }
      progress = await Progress.create({userId : userId, conceptId : conceptId});
      user.progress.push(progress._id);
      await user.save();
    } 
                                                                   
    if(progress.questionSolved.includes(questionId)) {
      return res.status(400).json({ error: "Question already completed" })
    }
    progress.questionSolved.push(questionId);                 
  

    await progress.save()
                                   

    return res.status(200).json({ message: "user progress updated" })
  }
   catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal server error" })
  }
}