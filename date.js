   
   module.exports = getDate; // parenthesis isiliye ni lgaya kyuki yaha execute ni krna


   function getDate() {
        var today = new Date();
        
        var options = {
            weekday : "long",
            day : "numeric",
            month : "long"
        };
        let day = today.toLocaleDateString("en-US",options);
        return day;
        
    }
    