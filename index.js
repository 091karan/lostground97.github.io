var api_url = "https://cors-anywhere.herokuapp.com/https://codeforces.com/api/";
var handle = "";

google.charts.load('current', {'packages':['corechart']});
//google.charts.setOnLoadCallback(drawChart);

var verdicts = {};
var langs = {};
var tags = {};
var levels = {};
var problems = {};
var totalSub = 0;
var heatmap = {};
var years = 0;
var str = "OK";

var req1,req2;

var titleTextStyle = {
  fontSize: 18,
  color: '#393939',
  bold: false
};
$(document).ready(function() {

  // When the handle form is submitted, this function is called...
  $("#handleform").submit(function(e) {

    e.preventDefault();
    
    handle = $("#handle").val().trim();
    if(!handle) {
      err_message("handleDiv","Enter a name");
      $("#mainSpinner").removeClass("is-active");
      return; // No handle is provided, we can't do anything.
    }


    // getting all the submissions of a user
    req1 = $.get(api_url + "user.status", { "handle": handle }, function(data, status) {
      console.log(data);

      $(".sharethis").removeClass("hidden");

      if(data.result.length < 1) {
        err_message("handleDiv","No submissions");
        return;
      }
      console.log(data.result.length);
      for (var i = data.result.length - 1; i >= 0; i--) {
        var sub = data.result[i];
        var problemId = sub.problem.contestId + '-' + sub.problem.index;
        if(sub.verdict=='OK')
        {
        if (levels[sub.problem.index[0]] === undefined) 
          levels[sub.problem.index[0]] = 1;
        else
          levels[sub.problem.index[0]] = levels[sub.problem.index[0]] + 1;
        }
        if (verdicts[sub.verdict] === undefined) 
        {
            verdicts[sub.verdict] = 1;
        }
        else
        {
          verdicts[sub.verdict] = verdicts[sub.verdict] + 1;  
        }
      }
      //data = Table that has 2 columns namely, Question Index and number of questions solved.
      var data = [];
      for (var level in levels) {
        data.push([level, levels[level]]);
      }
      data.sort(function(a, b) {
        if (a[0] < b[0]) return -1;
        else return 1;
      });
      levels = new google.visualization.DataTable();
      levels.addColumn('string','Level');
      levels.addColumn('number','solved');
      levels.addRows(data);

      var chart = new google.visualization.ColumnChart(document.getElementById('question_index'));
      chart.draw(levels, {width: 700, height: 500, title: 'Questions Solved'});



      data1 = [];
      for (var verdict in verdicts) {
        data1.push([verdict, verdicts[verdict]]);
      }
      data1.sort(function(a, b) {
        if (a[0] < b[0]) return -1;
        else return 1;
      });
      ver = new google.visualization.DataTable();
      ver.addColumn('string','Level');
      ver.addColumn('number','solved');
      ver.addRows(data1);
      
      var chart = new google.visualization.PieChart(document.getElementById('totalsubmission'));
      chart.draw(ver, {width: 700, height: 500, title: 'Total Submissions'});





    })
    .always(function() {
      $("#mainSpinner").removeClass("is-active");
      $(".share-div").removeClass("hidden");
    });
  });
});