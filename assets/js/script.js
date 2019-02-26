const quiz = [
{
	question: "Which of the following does not form cubic or right-angled crystals?",
	answers: ["Pyrite", "Garnet", "Bismuth", "Halite"],
	correct: 1,
	reveal: "Natural garnet crystals typically form as either dodecahedrons or trapezohedrons, two complex and unusually spherical polyhedra."
},{
	question: "Which semiprecious gem is formed from the same material as much of the Earth's mantle?",
	answers: ["Rhodonite", "Obsidian", "Peridot", "Carnelian"],
	correct: 2,
	reveal: "The upper layers of the mantle are mainly peridotite, a bright green blend of olivine and pyroxene."
},{
	question: "What unusual quality is alexandrite noted for?",
	answers: ["Changes color when brought outdoors", "Easily fractures into identical smaller crystals", "Burns readily in high-oxygen environments", "Gives off a distinct odor when scratched"],
	correct: 0,
	reveal: "Alexandrite appears pale green in direct sunlight and purple-red in incandescent lighting. The effect is caused by impurities absorbing a narrow band of yellow light."
},{
	question: "Which two gemstones are actually two varieties of the same mineral?",
	answers: ["Opal & Pearl", "Lapis Lazuli & Aquamarine", "Onyx & Jet", "Ruby & Sapphire"],
	correct: 3,
	reveal: "Corundum gemstones come in many different colors, most of which are known as sapphire. Ruby is simply a red variety, with chromium impurities being the only chemical difference."
},{
	question: "How long will I keep coming back to a crystal theme for these homework assignments?",
	answers: ["This is the last one", "Just a couple more", "Up to the first group project", "Until you tell me to stop"],
	correct: 3,
	reveal: "I'm not even that interested in gemology. I just thought it would make a good set of Hangman words."
}];

const startTime = 20;

var question;
var nextTimeout;
var time;
var timerInterval;
var results = {
	correct: 0,
	incorrect: 0,
	timeout: 0
}

$(document).ready(function() {


	$("#startButton").click(function() {
		$(this).hide();
		loadQuestion(quiz[0]);
	});


	// load a question object into the page
	function loadQuestion(q) {
		console.log("loading question", q);

		question = q;

		// set the question title from the index of the question in the quiz
		$("#questionTitle").text("Question " + (1 + quiz.indexOf(question)));

		// set the question text from the question object's question property (great names, past me)
		$("#questionText").text(question.question);


		// create a base element to use for each answer
		var answerBase = $('<button type="button" class="list-group-item list-group-item-action answer"></button>');

		// for each answer, create and add an item
		$("#answerList").empty().append(question.answers.map(answer =>
			answerBase
			.clone() // new item
			.text(answer) // set the text
			.click(answerClicked) // register click handler
			.attr("data-answer", question.answers.indexOf(answer)) // mark with index
			));

		// reset the reveal info
		$("#resultText").text("").removeClass();
		$("#revealText").text("");
		$("#nextButton").hide();
		$(".progress-bar").removeClass("timing").css("width", "0");

		time = startTime+1;
		timer();
		timerInterval = setInterval(timer, 1000);
	}


	function timer() {
		time--;
		$("#timerDisplay").text(":" + ((time<10)? "0":"") + time);

		if (time === 5) {
			$("#timerDisplay").addClass("flash");
		}

		if (time <= 0) {

			console.log("correct answer", this.innerText);
			results.timeout++; // save this moment for end results

			// find and highlight correct answer in green
			$(".answer[data-answer='" + question.correct + "']").addClass("answer-revealCorrect");

			$("#resultText").text("🤔 Time’s up").addClass("text-warning");

			endQuestion();
		}
	}


	function answerClicked() {

		// check answer index against correct answer
		if ($(this).attr("data-answer") == question.correct) {
			console.log("correct answer", this.innerText);
			results.correct++; // save this moment for posterity

			// highlight in green
			$(this).addClass("answer-correct");

			$("#resultText").text("😄 Correct!").addClass("text-success");

		} else {
			console.log("incorrect answer", this.innerText);
			results.incorrect++; // save this moment for blackmail

			// highlight in red, find and highlight correct answer in green
			$(this).addClass("answer-incorrect");
			$(".answer[data-answer='" + question.correct + "']").addClass("answer-revealCorrect");

			$("#resultText").text("😕 Incorrect").addClass("text-danger");

		}

		endQuestion();
		
	}


	function endQuestion() {

		// disable all answers, no second guessing
		$(".answer").attr("disabled","disabled");

		// display reveal
		$("#revealText").text(question.reveal);

		// show next button
		$("#nextButton").show();
		$(".progress-bar").addClass("timing").css("width", "100%");

		clearInterval(timerInterval);
		$("#timerDisplay").removeClass("flash");

		nextTimeout = setTimeout(nextQuestion, 10000);

	}

	function nextQuestion() {
		clearTimeout(nextTimeout);

		var nextQuestion = quiz[1 + quiz.indexOf(question)];
		if (nextQuestion) {
			loadQuestion(quiz[1 + quiz.indexOf(question)]);
		} else {
			showResults();
		}
	}

	$("#nextButton").click(nextQuestion);


	function showResults() {
		$("#questionTitle").text("Quiz Complete!");
		$("#questionText").text("");

		$("#timerDisplay").hide();

		// we'll reuse our answer section for displaying stats

		var answerBase = $('<div class="list-group-item"></div>');
		var stats = [
		results.correct + " correct",
		results.incorrect + " incorrect",
		results.timeout + " timed out"
		];
		var colors = ["success", "danger", "warning"];

		$("#answerList").empty().append(stats.map(stat =>
			answerBase.clone().text(stat).addClass("list-group-item-" + colors.shift())
			));

		// reset the reveal info
		$("#resultText").text("").removeClass();
		$("#revealText").text("");
		$("#nextButton").hide();
		$(".progress-bar").removeClass("timing").css("width", "0");

	}


});