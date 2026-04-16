import './About.css';

function About() {

    return (
        <div className='about-container'>
            <div className="title-text">About PeerPrep</div>
            PeerPrep is where technical interview practice becomes collaborative, focused, and real.
            Preparing alone can feel repetitive and isolating. PeerPrep transforms interview preparation into a dynamic, real-time experience by connecting you with like-minded peers who are working on the same topics and difficulty level as you.
            <br />
            <br />
            Simply create an account, choose your preferred difficulty — Easy, Medium, or Hard — and select the topic you want to tackle. Our smart matching system pairs you with another online user who shares your learning goals, so every session is relevant and purposeful.
            Once matched, you’ll receive a carefully selected interview-style question and enter a shared collaborative coding space. Here, you can brainstorm, discuss approaches, and build solutions together in real time — simulating the kind of technical discussions you’ll face in actual interviews.
            <br />
            <br />
            No match? No problem. If a suitable partner isn’t found within a set time, the session ends smoothly so you can adjust your preferences or try again.
            <br />
            <br />
            PeerPrep empowers you to:
            <br />
            <div className="button-group">
                <div className="box">Practice consistently</div>
                <div className="box">Learn actively through discussion</div>
                <div className="box">Build confidence under realistic conditions</div>
                <div className="box">Improve problem-solving skills collaboratively</div>
            </div>
            <br />
            Whether you’re preparing for internships, full-time roles, or sharpening your fundamentals, PeerPrep helps you practice smarter — together.
        </div>
    );
}

export default About;