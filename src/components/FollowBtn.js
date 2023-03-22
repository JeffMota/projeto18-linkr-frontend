import styled from "styled-components"

export default function FollowBtn({ following }) {
    return (
        <Container>
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
    color: #ffff;
    font-weight: 700;

    background-color: #1877F2;

`