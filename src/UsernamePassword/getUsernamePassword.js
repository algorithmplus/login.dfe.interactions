module.exports = (req,res)=>{
  res.render('usernamepassword/index', { isFailedLogin: false, message: '', csrfToken: req.csrfToken() });
};