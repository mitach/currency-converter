import './WelcomeSection.css';

const WelcomeSection: React.FC = () => {
    return (
        <article className="welcome-section">
            <h2 className="welcome-title">Welcome to Currency Converter</h2>
            <p className="welcome-subtitle">
                Convert currencies in real - time with our easy - to - use converter.
                Get accurate exchange rates for major world currencies instantly.
            </p>
            <img
                src='/currency-illustration.svg'
                alt="Currency conversion illustration"
                className="welcome-image"
            />
            <p className="welcome-subtitle">
                Start by entering an amount in any currency field below.
                All other fields will update automatically with converted values.
            </p>
        </article>
    );
};

export default WelcomeSection;