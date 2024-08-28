const Concept = require('../Model/Concept');
const Question = require('../Model/Question');
const Progress = require('../Model/Progress');

// create concept 
exports.createConcept =  async (req, res) => {
    try{
        
        // fetchData
        const {conceptName, description} = req.body;

        // validation
        if(!conceptName || !description){
            return res.status(400).json({
                success : false,
                message : 'All fields are required',
            });
        }


        const newConcept = await Concept.create({
            conceptName : conceptName, 
            description : description,
        });
         
        return res.status(200).json({
            success : true,
            message : 'Concept created successfully',
            data : newConcept,
        });

        
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success : false,
            message : 'Failed to create concept',
            error : error.message,
        });
    }
}


// getAllConcepts
exports.getAllConcepts = async (req, res) => {
    try{
        const allConcepts = await Concept.find({}, {
            conceptName : true,
            description : true,
        }).exec();

        return res.status(200).json({
            success : true,
            message : 'Concept fetched successfully',
            data : allConcepts,
        });
    }catch(error){
        console.error(error);  
        return res.status(500).json({
            success : false,
            message : 'Failed to fetch conceptList',
            error : error.message,
        });
    }
}

// update concept
exports.updateConcept = async (req, res) => {
    try{
        // data input
        const {conceptId} = req.body;
        const updates = req.body;
        const concept = await Concept.findById(conceptId);

        if(!concept){
            return res.status(404).json({
                success : false,
                message : "Concept not found",
            });
        }
        
        // Update only the fields that are present in the request body
        for(const key in updates) {
            if(updates.hasOwnProperty(key)) {
                concept[key] = updates[key]
            }
        }

        await concept.save();
        
        const updatedConcept = await Concept.findOne({_id: conceptId})
                                            .populate({ path: "questionList" })
                                            .exec();
        return res.status(200).json({
            success : true,
            message : "Concept updated successfully",
            data : updatedConcept,
        });
        
    }catch(error){
        console.error(error);  
        return res.status(500).json({
            success : false,
            message : 'Failed to update concept',
            error : error.message,
        });
    }
}

// delete concept
exports.deleteConcept = async (req, res) => {
    try{
        // data input
        const {conceptId} = req.body;
        // data validation
        if(!conceptId){
            return res.status(400).json({
                success : false,
                message : 'All fields are required',
            });
        }
        // delete data
        const concept = await Concept.findById(conceptId);
        const questionList = concept.questionList;
        for(const questionId of questionList){
            await Question.findByIdAndDelete(questionId);
        }

        await Concept.findByIdAndDelete(conceptId);

        return res.status(200).json({
            success : true,
            message : "Concept deleted successfully",
        });

    }catch(error){
        console.error(error);  
        return res.status(500).json({
            success : false,
            message : 'Failed to delete concept',
            error : error.message,
        });
    }
}

// get concept details
exports.getConceptDetails = async (req, res) => {
    try{
        const {conceptId} = req.body;
        

        const conceptDetails = await Concept.findOne(
                                    {_id : conceptId})
                                    .populate(
                                        {
                                          path: "questionList", 
                                        }
                                    ).exce();
        if(!conceptDetails){
            return res.status(400).json({
                success : false,
                message : `could not find the concept with ${conceptId}`,
            });
        }

        return res.status(200).json({
            success : true,
            message : 'Concept details fetched successfully',
            data : conceptDetails,
        });

    }catch(error){
        console.error(error);  
        return res.status(500).json({
            success : false,
            message : 'Failed to get concept details',
            error : error.message,
        });
    }
}

// exports.getConceptDetailsWithProgress = async (req, res) => { 
//     try {
//         const { conceptId } = req.body;
//         const userId = req.user.id;

//         // Fetch concept details and populate the question list
//         const conceptDetails = await Concept.findOne({ _id: conceptId })
//             .populate({
//                 path: "questionList",
//                 select: "title description url answer difficulty", // Select the required fields from the question schema
//             })
//             .exec();

//         // Fetch progress details and populate the solved questions
//         let progressDetails = await Progress.findOne({ conceptId: conceptId, userId: userId })
//             .populate({
//                 path: "questionSolved",
//                 select: "title description url difficulty", // Select relevant fields from the question schema
//             })
//             .exec();

//         if (!conceptDetails) {
//             return res.status(400).json({
//                 success: false,
//                 message: `Could not find the concept with ID ${conceptId}`,
//             });
//         }
        
//         return res.status(200).json({
//             success: true,
//             message: 'Concept details fetched successfully',
//             data: {
//                 conceptDetails,
//                 progressDetails,
//             },
//         });

//     } catch (error) {
//         console.error(error);  
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to get concept details',
//             error: error.message,
//         });
//     }
// };


exports.getConceptDetailsWithProgress = async (req, res) => { 
    try {
        const conceptId = mongoose.Types.ObjectId(req.body.conceptId);
        const userId = mongoose.Types.ObjectId(req.user.id);

        // Test fetching without populate
        let progressDetails = await Progress.findOne({ conceptId, userId });

        // Check if progressDetails exists
        if (!progressDetails) {
            console.log("Progress details not found");
        } else {
            console.log("Progress details found:", progressDetails);
        }

        // Continue with populate if document exists
        progressDetails = await Progress.findOne({ conceptId, userId })
            .populate({
                path: "questionSolved",
                select: "title description url difficulty",
            })
            .exec();

        if (!conceptDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find the concept with ID ${conceptId}`,
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Concept details fetched successfully',
            data: {
                conceptDetails,
                progressDetails,
            },
        });

    } catch (error) {
        console.error(error);  
        return res.status(500).json({
            success: false,
            message: 'Failed to get concept details',
            error: error.message,
        });
    }
};
