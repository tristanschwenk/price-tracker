const 
  isAdmin = (opts) => {
    return opts.data.mySuperSecret == 'mynameisgab';
  };

module.exports = {
  isAdmin
}