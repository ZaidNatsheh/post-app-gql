import React from "react";
import PostForm from "./PostForm";
import { useParams, useHistory } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation,useQuery } from "@apollo/react-hooks";

const GetPost = gql`
query GetPost($id:uuid!) {
    posts_by_pk(id: $id) {
      id
      title
      createdAt
      body
    }
  }
  `

  const UPDATE_POST = gql `
  mutation UpdatePost($id : uuid!,$title : String! ,$body:String!) {
    update_posts(where: {id: {_eq: $id}}, _set: {title: $title, body: $body}) {
      affected_rows
      returning {
        body
        title
        id
        createdAt
      }
    }
  }`
const classes = {
  div: "bg-white border rounded-lg overflow-hidden",
  header: "bg-gray-300 text-gray-700 py-3 px-4",
  h2: "text-sm font-semibold"
};

function EditPost() {
    const {id} = useParams();

        const history = useHistory()

    const [update,{loading : loading2 , error}] = useMutation(UPDATE_POST,{
        onCompleted : ()=> history.push('/')
    })
    const {data,loading} = useQuery(GetPost,{variables: {id}});

    if (loading) return <div>Loading . .</div>

    console.log({data}) 
    const onSave = ({title,body})=>{
        update({variables :{id,title,body}})
    }
  return (
    <div className={classes.div}>
      <header className={classes.header}>
        <h2 className={classes.h2}>Edit Post</h2>
      </header>
      <PostForm post ={data.posts_by_pk} onSave={onSave } loading = {loading2} error = {error}/>
    </div>
  );
}

export default EditPost;
