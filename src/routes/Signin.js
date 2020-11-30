const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const tokenService = require("../services/token");
const User = mongoose.model("User");

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email) {
        return res.status(200).send({ status: "fail", errorcode: 200 , error_message: "Must provide an email" });
      }
      if (!password) {
        return res.status(200).send({ status: "fail", errorcode: 200 , error_message: "Must provide a password" });
      }

      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(200).send({ status: "fail", errorcode: 200 , error_message: "sign in failed" });
      }

      try {
        await user.comparePassword(password);
        const token = tokenService.sign(user._id);
        res.send({ status: "success", data: {token, user} });
      } catch (e) {
        res.status(200).send({ status: "fail", errorcode: 200, error_message: "Invalid Password or Email" });
      }
    } catch (e) {}
  });
 
router.post("/signup", async (req, res) => {
    const {fullName, accountType, dob, gradYear, email, guardianName, guardiaEmail, gym, coachesName, coachEmail, youtubeChannel, instagramAccount, acceptedVerbalOffer, acceptedWrittenOffer, password} = req.body;

    if( !email || !password) {
        res.status(200).send({ status: "fail", errorcode: 401, error_message: "Missing email or password"});
    }

    // First check to see if the email alredy exits in the db
    const user_exists = await User.findOne({email: email.toLowerCase()});
    if (user_exists) {
        res.status(200).send({ status: "fail", errorcode: 401, error_message: "This user already exists in our database."});
    } else {
        // If there user is not in the DB:
        // 1. Go ahead and add it
        // 2. Create a jwt token and return that
        // 3. this token has to be sent back with every request for verification
        const user = new User({
            _id: mongoose.Types.ObjectId(),
            email: email.toLowerCase(),
            fullName,
            accountType,
            dob,
            gradYear,
            guardianName,
            guardiaEmail,
            gym,
            coachesName,
            coachEmail,
            youtubeChannel,
            instagramAccount,
            acceptedVerbalOffer,
            acceptedWrittenOffer,
            password
        });

        try {
            await user.save();

            try {
                const token = tokenService.sign(user._id);
                res.send({ status: "success", data: {token} });
            } catch (e) {
                res.status(422).send({ status: "fail", errorcode: 422, error_message: e });
            }
        } catch (e) {
            console.log("E: ", e)
        }
    }
});

router.get("/signout", async (req, res) => {
    res.status(200).send({ status: "success", data:{token: ""}});
});

router.post("/forgot", async (req, res) => {
    /**
     * 1. extract email from payload
     * 2. check if the email is in the DB
     * 3. generate a 15 min token for this transaction
     * 4. send link wirh token to user ?t=1234567890
     * 5. when user clicks save, use the token t to authorize the transaction
     */
     const { email, baseURL } = req.body;
     if (!email) {
         res.status(200).send({status: "fail", errorcode: 422, error_message: "You must provide an email"});
     }

     const user = await User.findOne({email});
     if (!user) {
        res.status(200).send({status: "fail", errorcode: 422, error_message: "This email is not in our database"});
     }

     const token = tokenService.sign(user._id, '15m');

     const output_link = `http://${baseURL}/reset.do?t=${token}`

     // TODO: send out email
     console.log(output_link);
     res.send({status:"success"});

});

router.post("/update", async (req, res) =>{
    /**
     * Always authorize update so long the token is passed in
     */
    const {token, user} = req.body;
    
    const {status,data} = await tokenService.verify(token);

    if(status == "success") {
        let findUser = await User.findOne({_id: data.userId});
        if (!findUser) {
            res.status(422).send({status: "fail",errorcode:422, error_message: "User not found"})
        } else {
            const userKeys = Object.keys(user);
            for (let key of userKeys) {
                findUser[key] = user[key];
            }
            await findUser.save();
            res.status(200).send({status: "success", data: user});
        }

    }else if( status == "fail") {
        res.status(401).send({status, errorcode: "Unauthorized", error_message: "invalid token"})
    }else {
        res.send({status: "fail"});
    }
})

module.exports = router;