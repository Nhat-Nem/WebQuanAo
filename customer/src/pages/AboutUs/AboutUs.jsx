import './AboutUs.css'
import useTitle from '../../hooks/useTitle'


function AboutUs() {
    useTitle('About Us ')

    return (
        <>  
            <div className="about-page">
                <h1>Bài này của nhóm: Lợi, Nam, Kiệt</h1>
            </div>
        </>
    )
}

export default AboutUs