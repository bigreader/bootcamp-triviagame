const quiz = [
{
	question: "Which semiprecious gem is formed from the same material as much of the Earth's mantle?",
	answers: ["Rhodonite", "Obsidian", "Peridot", "Carnelian"],
	correct: 2,
	reveal: "The upper layers of the mantle are mainly peridotite, a bright green blend of olivine and pyroxene.",
	image: "peridot"
},{
	question: "What unusual quality is alexandrite noted for?",
	answers: ["Changes color when brought outdoors", "Easily fractures into identical smaller crystals", "Burns readily in high-oxygen environments", "Gives off a distinct odor when scratched"],
	correct: 0,
	reveal: "Alexandrite appears pale green in direct sunlight and purple-red in incandescent lighting. The effect is caused by impurities absorbing a narrow band of yellow light.",
	image: "alexandrite"
},{
	question: "Which of the following does not form cubic or right-angled crystals?",
	answers: ["Pyrite", "Garnet", "Bismuth", "Halite"],
	correct: 1,
	reveal: "Natural garnet crystals typically form as either dodecahedrons or trapezohedrons, two complex and unusually spherical polyhedra.",
	image: "garnet"
},{
	question: "Which two gemstones are actually two varieties of the same mineral?",
	answers: ["Opal & Pearl", "Lapis Lazuli & Aquamarine", "Onyx & Jet", "Ruby & Sapphire"],
	correct: 3,
	reveal: "Corundum gemstones come in many different colors, most of which are known as sapphire. Ruby is simply a red variety, with chromium impurities being the only chemical difference.",
	image: "ruby-sapphire"
},{
	question: "How long will I keep coming back to a crystal theme for these homework assignments?",
	answers: ["This is the last one", "Just a couple more", "Up to the first group project", "Until you tell me to stop"],
	correct: 3,
	reveal: "I'm not even that interested in gemology. I just thought it would make a good set of Hangman words.",
	image: "citrine"
}];

const startTime = 20;

var question; // current question object
var time; // remaining time for question
var timerInterval; // Interval for timer
var nextTimeout; // Timeout for next question
var results; // object to track correct/incorrect/timeout counts

$(document).ready(function() {


	$("#startButton").click(function() {
		$(this).hide();
		results = { // clear any previous results
			correct: 0,
			incorrect: 0,
			timeout: 0
		}
		$("#timerDisplay").show();
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
			.attr("data-answer", question.answers.indexOf(answer)) // mark with index
			));

		// reset the reveal info
		$("#resultText").text("").removeClass();
		$("#revealText").text("");
		$("#nextButton").hide();
		$(".progress-bar").removeClass("timing").css("width", "0");

		time = startTime+1; // reset timer
		timerTick(); // reset display
		timerInterval = setInterval(timerTick, 1000); // start
	}


	function timerTick() {
		time--;
		$("#timerDisplay").text(":" + ((time<10)? "0":"") + time); // format and display time

		if (time === 5) { // start flashing once we run low on time
			$("#timerDisplay").addClass("flash");
		}

		if (time <= 0) { // time's up
			results.timeout++; // save this moment for end results

			revealCorrect();

			$("#resultText").text("🤔 Time’s up").addClass("text-warning");

			endQuestion();
		}
	}

	// set up click handler for dynamic answers
	$("#answerList").on("click", ".answer", answerClicked);

	function answerClicked() {

		// check answer index against correct answer
		if ($(this).attr("data-answer") == question.correct) {
			console.log("correct answer", this.innerText);
			results.correct++; // save this moment for posterity

			// highlight in green
			$(this).addClass("answer-correct");
			revealCorrect();

			$("#resultText").text("😄 Correct!").addClass("text-success");

		} else {
			console.log("incorrect answer", this.innerText);
			results.incorrect++; // save this moment for blackmail

			// highlight in red
			$(this).addClass("answer-incorrect");
			revealCorrect();

			$("#resultText").text("😕 Incorrect").addClass("text-danger");

		}

		endQuestion();
		
	}

	// find and highlight correct answer in green
	function revealCorrect() {
		$(".answer[data-answer='" + question.correct + "']")
		.addClass("answer-revealCorrect") // turn it green
		.append(
			$('<img class="answerIcon">') // add icon
			.attr("src", "assets/img/" + question.image + ".png")
		);
	}


	function endQuestion() {

		// disable all answers, no second guessing
		$(".answer").attr("disabled","disabled");

		// display reveal
		$("#revealText").text(question.reveal);

		// show next button
		$("#nextButton").show();
		$(".progress-bar").addClass("timing").css("width", "100%");

		// stop question timer
		clearInterval(timerInterval);
		$("#timerDisplay").removeClass("flash");

		// start timout to auto continue
		nextTimeout = setTimeout(nextQuestion, 10000);

	}
	

	$("#nextButton").click(nextQuestion);

	function nextQuestion() {
		clearTimeout(nextTimeout); // stop auto continue

		// check if there's questions left
		var next = quiz[1 + quiz.indexOf(question)];
		if (next) {
			loadQuestion(next);
		} else {
			showResults();
		}
	}


	function showResults() {
		$("#questionTitle").text("Quiz Complete");
		$("#timerDisplay").hide();

		// show a summary score
		$("#questionText").text("You got " + (100 * results.correct / quiz.length) + "% right!");

		// we'll reuse our answer section for displaying stats

		var answerBase = $('<div class="list-group-item"></div>'); // simpler base element
		var stats = [ // create our own list of rows
		results.correct + " correct",
		results.incorrect + " incorrect",
		results.timeout + " timed out"
		];
		var colors = ["success", "danger", "warning"]; // add colors to each row

		$("#answerList").empty().append(stats.map(stat =>
			answerBase
			.clone()
			.text(stat)
			.addClass("list-group-item-" + colors.shift())
			));

		// reset the reveal info
		$("#resultText").text("").removeClass();
		$("#revealText").text("");
		$("#nextButton").hide();
		$(".progress-bar").removeClass("timing").css("width", "0");

		// reactivate start button
		$("#startButton").text("Try Again").show();

	}

});