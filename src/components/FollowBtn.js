import styled from "styled-components"

export default function FollowBtn({ clickFunction, following }) {
    return (
        <Container onClick={clickFunction} following={following}>
            {(following) ? "Unfollow" : "Follow"}
        </Container>
    )
}

const Container = styled.button`
    display: flex;
    width: 112px;
    height: 31px;

    cursor: pointer;

    align-items: center;
    justify-content: center;

    border: none;
    border-radius: 5px;

    font-family: "Lato", sans-serif;
    color: ${props => (props.following) ? "#1877F2" : "#FFFFFF"};
    font-weight: 700;

    background-color: ${props => (props.following) ? "#FFFFFF" : "#1877F2"};

`