import styled from "styled-components"
import { useState } from "react"
import { AiOutlineSearch } from 'react-icons/ai';
import { useContext } from "react";
// import {DebounceInput} from 'react-debounce-input';
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";



export default function SearchBar() {
    const navigate = useNavigate()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [toggleResult, setToggleResult] = useState(false)
    const { infosUser } = useContext(AuthContext);


    async function fetchData() {
        try {
            const payload = {username:search}
            const req = await axios.post(process.env.REACT_APP_API_URL + '/search',  payload,{
                headers: { authorization: `Bearer ${infosUser.token}` }} )
            setSearchResult(req.data)
            console.log(searchResult)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (search.length > 2) {
            fetchData();
        }
        else {
            setSearchResult([])
        }
    }, [search]);

    function searchUser(e) {
        setSearch(e.target.value)
        console.log(search)
    }
    function goUserPage(id) {
        setSearchResult([])
        navigate(`/user/${id}`)
    }

    return (
        <SearchBarContainer data-test="search" >
            <FixSearch>
                <SearchInput
                    minLength={3}
                    debounceTimeout={300}
                    onChange={searchUser}
                    placeholder="Search for people" />
                <SearchIcon />
            </FixSearch>
            <SearchBarResult>
                {(!searchResult ? (<></>) :
                    (searchResult.map((r) => <ResultBox data-test="user-search">
                        <Img onClick={() => { goUserPage(r.id) }} src={r.pictureUrl} />
                        <Username onClick={() => { goUserPage(r.id) }} >{r.username}</Username>
                        <Following>{r.following? "• following" :<></>}</Following>
                        
                    </ResultBox>
                    )))}
            </SearchBarResult>
        </SearchBarContainer>
    )
}

const SearchBarContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: calc(43vw);
    left: 437px;
    background: #FFFFFF;
    border-radius: 8px;
    background-color: white;
    z-index:1;`

const SearchInput = styled.input`
    flex: 1;
    border-radius: 8px;
    background-color: white;
    border:none;
    padding: 10px;
    width: calc(41vw);
    z-index: 1;
`

const SearchIcon = styled(AiOutlineSearch)`
    position: relative;
    width: calc(1vw);
    top: 10px;
    color: #888;
    margin-right: 10px;
    z-index:3; `

const SearchBarResult = styled.div`
    width: 568px;
    width: calc(43vw);
    background-color: #E7E7E7;
    border-radius: 8px;
    position: absolute;
    top:48px;
    z-index:2;`

const FixSearch = styled.div`
display: flex;
justify-content: space-between;
`
const Img = styled.img`
margin-top: 10px;
margin-left: 20px;
margin-bottom: 10px;
border-radius: 304px;
width: 39px;
height: 39px;
`

const ResultBox = styled.div`
display:flex;
`
const Username = styled.div`
margin-top:20px;
margin-left:10px;
font-size: 19px;
`

const Following = styled.div`
margin-top:20px;
margin-left:10px;
color: #C5C5C5;
font-family: 'Lato';
font-style: normal;
font-weight: 400;
font-size: 19px;
line-height: 23px;
`