var express=require('express')
var exp=express();
var mongodb=require('mongojs')
var db=mongodb('mongodb://owl:studyowl7@ds245680.mlab.com:45680/nagaprudvi',['studyowl'])
//var Datastore=require('nedb');
//var db=new Datastore({filename:'data', autoload:true});
var bodyparser=require('body-parser')
exp.use(express.static('public'))
exp.use(bodyparser.urlencoded({ extended : false}))
var session=require('express-session')
exp.use(session({secret:'asdf'}))

exp.set('port',process.env.PORT||5000)

var ejs=require('ejs')
exp.set('view engine','ejs')

exp.get('/home',function(req,res)
{
	if(req.session.pw==true)
	{
		res.redirect('/logged')
	}
	else{
	res.sendFile(__dirname+'/public/homes.html')
}
})
exp.get('/applyform',function(req,res){
	if(req.session.pw==true){
		res.redirect('/logged');
	}
	else{
	res.sendFile(__dirname+'/public/application.html')
}
	})

exp.get('/stdreg',function(req,res){
	if(req.session.pw==true){
		res.redirect('/logged');
	}
	else{
	res.sendFile(__dirname+'/public/studentreg.html')
}
})
exp.post('/stdlogin',function(req,res){
	var doc={
		firstname:req.body.fname,
		collegename:req.body.clgname,
		coursename:req.body.cname,
		email:req.body.email,
		password:req.body.password,
		contactnumber:req.body.number,
		date:req.body.date,
	}
	db.studyowl.find({email:req.body.email},function(err,docw){
		if(docw==0)
		{
	db.studyowl.insert(doc,function(err,newdoc){
		console.log(newdoc)
		if(req.session.pw==true){
		res.redirect('/logged');
	}
	else{
		res.sendFile(__dirname+'/public/studentlog.html')
	}
	})
}
	else{
		res.send('please this email id is exist try another')
	}
})
})
exp.post('/loginsubmit',function(req,res){
	var docc={
		email:req.body.email,
		password:req.body.password 
	}
	db.studyowl.find(docc,function(err,newdoc){
		if(newdoc.length>0)
		{
			req.session.pw=true;
			req.session.username=newdoc;
			db.studyowl.find({},function(error,docw){
				
					res.render('project',{result:docw,user:newdoc[0].firstname});
					
			})
		}
		else{
			res.send('password wrong')
		}
	})	
})
exp.get('/alogin',function(req,res)
{
	if(req.session.pw==true)
	{
		res.redirect('/logged')
	}
	else{
	res.sendFile(__dirname+'/public/admin.html')
	}
})
exp.post('/adminlogin',function(req,res)
{
	var adminname=req.body.aname; var password=req.body.password
	if(adminname=='prasanth'&&password=='studyowl')
	{
	db.studyowl.find({},function(err,docs){
		res.render('project',{result:docs,user:req.session.fname})
	})
}
else
{
	res.send('your are not a admin')
}
})
exp.get('/about',function(req,res){
	res.sendFile(__dirname+'/public/about.html')
})
exp.get('/stdlogin',function(req,res){

if(req.session.pw==true)
	{
		res.redirect('/logged')
	}
	else{

	res.sendFile(__dirname+'/public/studentlog.html')
}
})
exp.get('/logged',function(req,res){
	db.studyowl.find({},function(err,docs){
		res.render('project',{result:docs,user:req.session.fname})
	})
})

exp.get('/profile/:fname',function(req,res){
		db.studyowl.find({firstname:req.params.fname},function(err,docs){
			if(req.session.pw==true)
			{

			res.render('own',{re:docs});
		}

		else{
			res.redirect('/stdlogin');
		}
})})
exp.get('/logout/',function(req,res){
	req.session.destroy(function(){
		res.redirect('/stdlogin')
	})
	
})
exp.listen(exp.get('port'),function(){
	console.log('it is 7700')
})