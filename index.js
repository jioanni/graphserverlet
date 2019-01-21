const express = require('express');
const app = express()
const volleyball = require('volleyball')
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const PORT = process.env.PORT || 3000
const coursesData = require('./courseData')

app.use(volleyball)

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    course(id: Int!): Course
    courses(topic: String): [Course]
  },
  type Mutation {
    updateCourseTopic(id: Int!, topic: String!): Course
  },
  type Course {
    id: Int
    title: String
    author: String
    description: String
    topic: String
    url: String
  }
`);

const getCourse = (args) => {
  var id = args.id;
  return coursesData.filter(course => {
    return course.id == id
  })[0];
}

const getCourses = (args) => {
  if (args.topic) {
    var topic = args.topic;
    return coursesData.filter(course => {
      course.topic === topic
    })
  } else {
    return coursesData;
  }
}

const updateCourseTopic = ({id, topic}) => {
  coursesData.map(course => {
    if (course.id === id) {
      course.topic = topic;
      return course;
    }
  })
  return coursesData.filter(course => course.id ===id)[0]
}

// The root provides a resolver function for each API endpoint
var root = {
  course: getCourse,
  courses: getCourses,
  updateCourseTopic: updateCourseTopic
};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }));

app.listen(PORT, console.log(`Server up and listening on ${PORT}/graphql`))

