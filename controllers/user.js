const client = require('../connections/db')
const uuid = require('uuid')

exports.users = async (req, res) => {
    console.log("User Api Triggred")
    try {
        const UUID = uuid.v4()
        const createtableEmployees = `create table if not exists Employees(id VARCHAR(100) primary key not null,fullName text not null,dept text not null,salary real,address char(50),branch text not null)`
        await client.query(createtableEmployees)
        const user = req.body;
        let data = await client.query(`select * from employees where fullName='${user.fullName}'`)
        console.log("----->", data.rowCount)
        if (data.rowCount > 0) {
            console.log(data)
            return res.status(400).json({ sucess: false, menubar: "UserName is already exits" })

        } else {
            const insertQuery = `insert into Employees(id, fullName, dept, salary,address,branch) 
                       values('${UUID}', '${user.fullName}', '${user.dept}', ${user.salary},'${user.address}', '${user.branch}' )`
            console.log("----+", insertQuery)
            await client.query(insertQuery, (err, result) => {
                // console.log("--->",result.rows)
                if (!err) {
                    return res.status(200).json({ success: true, message: "Registered Successfully" })
                }
                else {
                    res.status(400).json({ "message": "fail" })
                    console.log("---->", err.message)
                }
            })
        }
    }
    catch (err) {
        console.log(err)
        res.send(err)
    }
    client.end;
}

// ------------------------------------------------------------------ //

exports.getAllusers = async (req, res) => {
    console.log("Get All users API trigrred");
    try {
        await client.query(`select * from employees`, (err, result) => {
            if (err) {
                console.log("--->", err)
                res.status(400).json({ success: fail, err })
            }
            else {
                res.status(200).json({ success: true, data: result.rows })
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: false, err })
    }
    client.end;
}

// ------------------------------------------------------------------ //

exports.UpdateAgeGender = async (req, res) => {
    console.log("Update Age Gender API trigrred")
    try {
        const data = req.body
        await client.query(`update employees set gender='${data.gender}',age=${data.age} where id='${req.params.id}'`, (err, result) => {
            if (err) {
                res.status(400).json({ success: false, "message": "someting went Wrong" })
            }
            else {
                return res.status(200).json({ success: true, message: "Inserted Successfully" })
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: false, err })
    }
    client.end;
}

// ------------------------------------------------------------------ //

exports.DeleteRecord = async (req, res) => {
    console.log("Delete Record Api is trigrred")
    try {
        await client.query(`delete from employees where id='${req.params.id}'`, (err, result) => {
            if (err) {
                console.log(err)
                res.status(400).json({ success: false, "message": "someting went Wrong" })
            }
            else {
                return res.status(200).json({ success: true, message: "Deleted Successfully" })
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: false, err })
    }
    client.end;
}

// ------------------------------------------------------------------ //

exports.imageUpload = async (req, res) => {
    // console.log("_____>",req)
    console.log("imageUpload Api is triggred")
    try {
        const imageTable = `create table if not exists EmployeesImage(id VARCHAR(100) primary key not null,file VARCHAR(100) not null)`
        await client.query(imageTable, async (err, result) => {
            if (err) {
                console.log("___>", err)
                res.status(400).json({ success: true, "message": "someting went Wrong" })
            }
            else {
                // return res.status(200).json({ success: true, message: "table created Successfully"})
                const image = `select * from EmployeesImage where id='${req.params.id}'`
                await client.query(image, async (err, result) => {
                    if (err) {
                        console.log(err)

                    }
                    else if (result.rowCount > 0) {
                        // console.log(data)
                        return res.status(400).json({ sucess: false, message: "image is already exists" })
                    }
                    else {
                        console.log(req.file)
                        const filename = req.file.filename;
                        console.log("----->", filename)
                        const basepath = `${req.protocol}://${req.get('host')}/public/uploads/`;
                        const insertQuery = `insert into EmployeesImage(id, file) 
                              values('${req.params.id}', '${basepath}${filename}')`
                        await client.query(insertQuery, (err, result) => {
                            // console.log("--->",result.rows)
                            if (!err) {
                                return res.status(200).json({ success: true, message: "Successfully" })
                            }
                            else {
                                res.status(400).json({ "message": "fail" })
                                console.log("---->", err.message)
                            }
                        })
                    }
                })
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: false, err })
    }
    client.end;
}

// ------------------------------------------------------------------- //

exports.getImage = async (req, res) => {
    console.log("get Image Api is triggred")
    try {
        await client.query(`select * from EmployeesImage where id='${req.params.id}'`, (err, result) => {
            if (err) {
                res.status(400).json({ success: false, "message": "someting went Wrong" })
            }
            else {
                res.status(200).json({ success: true, data: result.rows })
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: false, err })
    }
    client.end;
}

// ---------------------------------------------------------------------------//

exports.matchedDataImage = async (req, res) => {
    console.log("Matched Data image Api is triggred")
    try {
        await client.query(`select fullname,dept,salary,address,branch,age,gender,file from employees inner join EmployeesImage on employees.id = EmployeesImage.id;`, (err, result) => {
            if (err) {
                console.log(err)
                res.status(400).json({ success: false, "message": "someting went Wrong" })
            }
            else {
                res.status(200).json({ success: true, data: result.rows })
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: false, err })
    }
    client.end;
}

// ----------------------------------------------------------------------- //

exports.getbyDept = async (req, res) => {
    console.log("get by dept api is triggered")
    console.log("----->", req.body)
    try {
        const data = req.body
        await client.query(`select * from employees where branch like '${data.branch}' and dept like '${data.dept}'`, (err, result) => {
            if (err) {
                console.log(err)
                res.status(400).json({ success: false, "message": "someting went Wrong" })
            }
            else {
                res.status(200).json({ success: true, Data: result.rows })
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: false, err })
    }
}

// ------------------------------------------------------------- //

exports.updateToNewTable = async (req, res) => {
    console.log("update the data to new table api is created")
    try {
        const newTable = `create table if not exists EmployeesHired(id VARCHAR(100) primary key not null,fullName text not null,dept text not null,hireDate VARCHAR(100))`
        await client.query(newTable, (err) => {
            if (err) {
                console.log(err)
                res.status(400).json({ success: false, "message": "data is already inserted" })
            }

            // else{
            //     res.status(200).json({ success: true, "message": "Table Created Successfully" })
            // }
        })

        //  this api is used to dump the data into new table using some condition

        await client.query(`insert into employeesHired(id,fullName,dept,hireDate) select id,fullname,dept,hiredate from employees WHERE hiredate LIKE '%18';`, (err, result) => {
            if (err) {
                console.log(err)
                res.status(400).json({ success: false, message: "Data is already inserted" })
            }
            else {
                res.status(200).json({ success: true, message: "inserted successfully" })
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: false, err })
    }
}

// ----------------------------------------------------------------- //
// for all types of date formate visit https://linuxhint.com/convert-timestamp-to-date-format-javascript/

const timestamp = Date.now()
console.log("------>", timestamp);
const date = new Date(timestamp);
dateFormat = date.getHours() + ":" + date.getMinutes() + ", " + date.toDateString();
console.log("------->", dateFormat);

// ----------------------------------------------------------------------------------------------------------------------------- //
// postman : http://localhost:3000/api/logData/CheckIn/e2aeb693-ebb8-4bde-b739-90950fd55b7e change the value : checkin 
//           http://localhost:3000/api/logData/CheckOut/e2aeb693-ebb8-4bde-b739-90950fd55b7e change the value : checkOut

exports.CheckedIn = async (req, res) => {
    console.log("Checked In  api is triggred ")
    try {
        console.log(req.params)
        const TimeStamp = Date.now();
        console.log("TimeStamp")
        const dateObject = new Date(TimeStamp);
        const date = dateObject.getDate();
        const month = dateObject.getMonth() + 1;
        const year = dateObject.getFullYear();
        const hours = dateObject.getHours();
        const mins = dateObject.getMinutes()
        dateFormat = `${year}/${month}/${date}`
        TimeFormat = `${hours}:${mins}`
        console.log(dateFormat, TimeFormat)

        await client.query(`create TABLE if not exists logData(id VARCHAR(100) not null, checkIn_time VARCHAR(100) not null, checkOut_time VARCHAR(100) not null,Log_Date VARCHAR(100) not null) `, async (err) => {
            if (err) {
                console.log(err)
                res.status(400).json({ success: false, "message": "someting went Wrong", err })
            }
        })
        if (req.params.value == 'CheckIn') {
            const AlreadyCheckin = `select checkin_time from logdata where id='${req.params.id}' and log_date='${dateFormat}'`
            await client.query(AlreadyCheckin, async (err, result) => {
                console.log(result)
                if (err) {
                    console.log(err);
                    res.status(400).json({ success: false, message: "someting went Wrong" })
                }
                else if (result.rowCount > 0) {
                    res.status(400).json({ success: false, message: "Already checked in " })
                }
                else {
                    const insertQuery = `insert into logData(id,checkIn_time,checkOut_time,Log_Date)values('${req.params.id}','${TimeFormat}','${TimeFormat}','${dateFormat}')`
                    console.log("----+", insertQuery)
                    await client.query(insertQuery, (err, result) => {
                        if (err) {
                            console.log(err);
                            res.status(400).json({ success: false, message: "someting went Wrong" })
                        }
                        else {
                            res.status(200).json({ success: true, message: "checked IN successfully" })
                        }
                    })

                }
            })
        }
        else if (req.params.value = 'checkOut') {
            const withoutCheckIn = `select checkin_time from logdata where id='${req.params.id}' and log_date='${dateFormat}'`
            await client.query(withoutCheckIn, async (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(400).json({ success: false, message: "someting went Wrong" })
                }
                else if (result.rowCount == 0) {
                    res.status(400).json({ success: false, message: "Please checked In" })
                }
                else {
                    const updateCheckoutQuery = `update logData set checkOut_time='${TimeFormat}' where id='${req.params.id}' and Log_Date='${dateFormat}'`
                    console.log("----+", updateCheckoutQuery)
                    await client.query(updateCheckoutQuery, (err, result) => {
                        if (err) {
                            console.log(err);
                            res.status(400).json({ success: false, message: "someting went Wrong" })
                        }
                        else {
                            res.status(200).json({ success: true, message: "checked out successfully" })
                        }
                    })

                }
            })

        }

    } catch (err) {
        console.log(err)
        res.status(400).json({ success: false, err })

    }
}

// ---------------------------------------------------------- //

