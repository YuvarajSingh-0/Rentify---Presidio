import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PropertyCard = (props) => {
    const { id, name, location, city, price, tenant, owner, images, amenities, description } = props.info;
    const [currentImage, setCurrentImage] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isHovering && images.length > 1) {
            const timer = setInterval(() => {
                setCurrentImage((currentImage + 1) % images.length);
            }, 3000); // Change image every 3 seconds
            return () => clearInterval(timer);
        }
    }, [isHovering, currentImage, images]);

    return (
        <div className="card"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => navigate(`/property/${id}`)}>
            <div className="card-image">
                {images && images.length > 0 ? (
                    images.map((image, index) => (
                        image.length > 0 && <img
                            key={index}
                            src={image}
                            alt='house'
                            className={`transition-all duration-1000 ${currentImage === index ? 'active' : ''}`}
                        />
                    ))
                ) : (
                    <img
                        src="https://wearehpi.org/wp-content/uploads/2017/07/placeholder.jpg"
                        alt='house'
                        className={`transition-all duration-1000 active`}
                    />
                )}
            </div>
            <div className="card-info">
                {tenant ? <h3 className="badge green-badge">Occupied</h3> : <h3 className="badge red-badge">Vacant</h3>}
                <table>
                    <tr>
                        <td>Property</td>
                        <td>{name}</td>
                    </tr>
                    {tenant &&
                        (<tr>
                            <td>Resident</td>
                            <td>{tenant?.email}</td>
                        </tr>)}
                    <tr>
                        <td>Contact</td>
                        <td>{owner.contact}</td>
                    </tr>
                    <tr>
                        <td>Amenities</td>
                        <td>{amenities.join(', ')}</td>
                    </tr>
                    <tr>
                        <td>Description</td>
                        <td>{description}</td>
                    </tr>
                    <tr>
                        <td>Location</td>
                        <td>{location}</td>
                    </tr>
                    <tr>
                        <td>City</td>
                        <td>{city}</td>
                    </tr>
                    <tr>
                        <td>Price</td>
                        <td>{price}</td>
                    </tr>
                </table>
            </div>
        </div>
    )
}
export default PropertyCard;