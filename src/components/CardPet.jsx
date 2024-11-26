import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import moment from "moment"; // For date formatting

export default function CardPet({ user, showActions = true }) {
  const {
    displayName,
    categoryBreed,
    photoURL,
    dob,
    petSex,
    isFixed,
    categoryColor,
    id: petId,
  } = user;

  // Format the date of birth
  const formattedDOB = moment.unix(dob.seconds).format("MMM Do, YYYY");

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/petProfile", { state: { petId } });
  };

  return (
    <CardContainer onClick={handleCardClick}>
      <Card>
        <Image src={photoURL} alt={`${displayName}'s photo`} />
        <CardContent>
          <Title>{displayName}</Title>
          <Paragraph>
            {categoryBreed.label} - {petSex} - {categoryColor.label}
          </Paragraph>
          <Paragraph>
            Born on {formattedDOB} -{" "}
            {isFixed ? "Neutered/Spayed" : "Not Neutered/Spayed"}
          </Paragraph>
        </CardContent>
      </Card>
    </CardContainer>
  );
}

// Styled Components
const CardContainer = styled.div`
  cursor: pointer;
`;

const Card = styled.div`
  margin: 15px 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s;
  &:hover {
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  background-color: #f0f0f0;
`;

const CardContent = styled.div`
  padding: 15px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.25rem;
`;

const Paragraph = styled.p`
  color: #333;
  margin: 5px 0;
`;
