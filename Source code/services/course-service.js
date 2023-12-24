const {
  models: { Course, User, Enrollment, Lesson, Resource, Comment },
} = require("../models");

const { Op } = require("sequelize");

exports.findAllCoursesByName = async (query, page = 1, pageSize = 10) => {
  try {
    const offset = (page - 1) * pageSize;

    const whereClause = {};

    if (query) {
      whereClause[Op.or] = [{ name: { [Op.like]: `%${query}%` } }];
    }

    const { count, rows } = await Course.findAndCountAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
    });

    return {
      total: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
      pageSize: pageSize,
      courses: rows,
    };
  } catch (error) {
    console.error("Error findning course by name:", error);
    throw error;
  }
};

exports.getCourseDetailForStudent = async (id, userId) => {
  try {
    const course = await Course.findByPk(id, {
      include: [
        {
          model: User,
          as: "students",
          through: {
            model: Enrollment,
            where: {
              userId,
            },
          },
          attributes: [],
          required: true,
        },
        {
          model: Lesson,
        },
        {
          model: Resource,
        },
        {
          model: Comment,
        },
      ],
    });
    if (!course) {
      throw new Error("Course not found");
    }
    return course;
  } catch (error) {}
};

exports.getCourseDetailForInstructor = async (id, userId) => {
  try {
    const course = await Course.findOne({
      where: {
        id,
        instructorId: userId,
      },
      include: [
        {
          model: Lesson,
        },
        {
          model: Resource,
        },
        {
          model: Comment,
        },
      ],
    });
    if (!course) {
      throw new Error("Course not found");
    }
    return course;
  } catch (error) {}
};

exports.createCourse = async (data, userId) => {
  try {
    const { name, image, description } = data;
    return Course.create({ name, image, description, instructorId: userId });
  } catch (error) {}
};

exports.updateCourse = async (data, id, userId) => {
  try {
    const { name, image, description } = data;
    const course = await Course.findOne({
      where: {
        id,
        instructorId: userId,
      },
    });
    if (!course) {
      throw new Error("Course not found");
    }
    return course.update({ name, image, description });
  } catch (error) {}
};

exports.deleteCourse = async (id, userId) => {
  try {
    const course = await Course.findOne({
      where: {
        id,
        instructorId: userId,
      },
    });
    if (!course) {
      throw new Error("Course not found");
    }
    const enrollment = await Enrollment.findOne({
      where: {
        courseId: id,
      },
    });
    if (enrollment) {
      throw new Error("Course has enrollment, cannot delete");
    }
    return Promise.all([
      course.destroy(),
      Lesson.destroy({
        where: {
          courseId: id,
        },
      }),
    ]);
  } catch (error) {}
};

exports.createLesson = async (data, courseId, userId) => {
  try {
    const course = await Course.findOne({
      where: {
        id: courseId,
        instructorId: userId,
      },
    });
    if (!course) {
      throw new Error("Course not found");
    }
    const { name, content } = data;
    return Lesson.create({ name, content, courseId });
  } catch (error) {}
};

exports.updateLesson = async (data, courseId, lessonId, userId) => {
  try {
    const lesson = await Lesson.findByPk(lessonId, {
      include: {
        model: Course,
        where: {
          id: courseId,
          instructorId: userId,
        },
      },
    });
    if (!lesson) {
      throw new Error("Lesson not found");
    }
    const { name, content } = data;
    return lesson.update({ name, content });
  } catch (error) {}
};

exports.deleteLesson = async (courseId, lessonId, userId) => {
  try {
    const lesson = await Lesson.findByPk(lessonId, {
      include: {
        model: Course,
        where: {
          id: courseId,
          instructorId: userId,
        },
      },
    });
    if (!lesson) {
      throw new Error("Lesson not found");
    }
    return lesson.destroy();
  } catch (error) {}
};

exports.createResource = async (data, courseId, userId) => {
  try {
    const course = await Course.findOne({
      where: {
        id: courseId,
        instructorId: userId,
      },
    });
    if (!course) {
      throw new Error("Course not found");
    }
    const { resourceName, filePath } = data;
    return Resource.create({ resourceName, filePath, courseId });
  } catch (error) {}
};

exports.updateResource = async (data, courseId, resourceId, userId) => {
  try {
    const resource = await Resource.findByPk(resourceId, {
      include: {
        model: Course,
        where: {
          id: courseId,
          instructorId: userId,
        },
      },
    });
    if (!resource) {
      throw new Error("Resource not found");
    }
    const { resourceName, filePath } = data;
    return resource.update({ resourceName, filePath });
  } catch (error) {}
};

exports.deleteResource = async (courseId, resourceId, userId) => {
  try {
    const resource = await Resource.findByPk(resourceId, {
      include: {
        model: Course,
        where: {
          id: courseId,
          instructorId: userId,
        },
      },
    });
    if (!resource) {
      throw new Error("Resource not found");
    }
    return resource.destroy();
  } catch (error) {}
};

exports.addComment = async (data, courseId, userId) => {
  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      throw new Error("Course not found");
    }
    const { content } = data;
    return Comment.create({ content, courseId, userId });
  } catch (error) {}
};

exports.deleteComment = async (courseId, userId, commentId) => {
  try {
    const comment = await Comment.findOne({
      where: {
        id: commentId,
        courseId,
        userId,
      },
    });
    if (!comment) {
      throw new Error("Comment not found");
    }
    return comment.destroy();
  } catch (error) {}
};
