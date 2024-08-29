const Question = require("../Model/Question");
const Concept = require("../Model/Concept");

// create Question

exports.createQuestion = async (req, res) => {
    try{
        const {conceptId, title, description, url, answer, difficulty} = req.body;
        if(!title || !url || !answer || !difficulty || !description || !conceptId){
            return res.status(400).json({
                success : false,
                message : 'All fields are required',
            });
        }

        const newQuestion = await Question.create({
            title : title,
            description : description,
            url : url,
            answer : answer,
            difficulty : difficulty,
        });

        const updatedConcept = await Concept.findByIdAndUpdate(conceptId, 
                                                    {
                                                        $push : {
                                                            questionList : newQuestion._id,
                                                        }
                                                    },
                                                    {new : true});
        // log updated concept here, after adding populate query
        return res.status(200).json({
            success : true,
            message : 'Question created successfully',
            data : newQuestion,
            updatedConcept,
        });                                           
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success : false,
            message : 'Failed to create Question',
            error : error.message,
        });
    }
}


exports.updateQuestion = async (req, res) => {
    try{
        const { questionId, title, description, url, answer, difficulty} = req.body;
        if(!title || !url || !answer || !difficulty || !description || !questionId){
            return res.status(400).json({
                success : false,
                message : 'All fields are required',
            });
        }

        const updatedQuestion = await Question.findById(questionId);
        if(!updatedQuestion){
            return res.status(404).json({
                success : false,
                message : "question not found",
            });
        }
        updatedQuestion.title = title,
        updatedQuestion.description = description;
        updatedQuestion.url = url;
        updatedQuestion.answer = answer;
        updatedQuestion.difficulty = difficulty;

        await updatedQuestion.save();

        // log updated concept here, after adding populate query
        return res.status(200).json({
            success : true,
            message : 'Question updated successfully',
            data : updatedQuestion,
        });                                           
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success : false,
            message : 'Failed to update Question',
            error : error.message,
        });
    }
}


exports.deleteQuestion = async (req, res) => {
    try {
      const { questionId, conceptId } = req.body
      await Concept.findByIdAndUpdate( { _id: conceptId },  {$pull: {questionList: questionId,},} )
      
      const question = await Question.findByIdAndDelete({ _id: questionId })
  
      if(!question){
        return res.status(404).json({ success: false, message: "Question not found" })
      }

      const updatedConcept = await Concept.findById(conceptId).populate("questionList")
  
      return res.json({
        success: true,
        data:updatedConcept,
        message: "Question deleted successfully",
      })
    }
     catch(error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the Question",
      })
    }
  }

  exports.getAllQuestionsWithConcepts = async (req, res) => {
    try{
        const allQuestions = await Concept.find({})
    .populate({
        path: 'questionList',
        select: 'title description url answer difficulty -_id', 
    })
    .select('conceptName questionList -_id') 
    .exec();

        return res.status(200).json({
            success : true,
            message : 'Questionlist fetched successfully',
            data : allQuestions,
        });
    }catch(error){
        console.error(error);  
        return res.status(500).json({
            success : false,
            message : 'Failed to fetch questionList',
            error : error.message,
        });
    }
}