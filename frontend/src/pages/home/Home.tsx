import './Home.css';

import WelcomeSection from '../../components/home/WelcomeSection/WelcomeSection';
import Converter from '../../components/home/Converter/Converter';

const Home: React.FC = () => {
	return (
		<section className="home-page">
			<WelcomeSection />
			<Converter />
		</section>
	);
};

export default Home; 