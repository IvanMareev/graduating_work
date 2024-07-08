import { fetcherDelete, fetcherPatch, fetcherPost } from "@/app/api/fetchers";
import { mutate } from "swr";
import { GenerationResult, Generator, Section, Topic } from "../types/model";

function getDisciplineTreeCollectionKey(disciplineId: number) {
    return `disciplines/${disciplineId}/sections`;
}

// Create actions
const createSection = async (disciplineId: number, data: any) => {
    const actionKey = `disciplines/${disciplineId}/new/section`;
    await fetcherPost(actionKey, data);
    await mutate(getDisciplineTreeCollectionKey(disciplineId));
};

const createTopic = async (disciplineId: number, sectionId: number, data: any) => {
    const actionKey = `sections/${sectionId}/new/topic`;
    await fetcherPost(actionKey, data);
    await mutate(getDisciplineTreeCollectionKey(disciplineId));
};

const createGenerator = async (disciplineId: number, topicId: number, data: any) => {
    const actionKey = `topics/${topicId}/new/generator`;
    await fetcherPost(actionKey, data);
    await mutate(getDisciplineTreeCollectionKey(disciplineId));
};

const createTask = async (disciplineId: number, topicId: number, data: any) => {
    const actionKey = `topics/${topicId}/new/task`;
    await fetcherPost(actionKey, data);
    await mutate(getDisciplineTreeCollectionKey(disciplineId));
};

const createTaskGenerator = async (disciplineId: number, taskId: number, generatorId: number) => {
    const actionKey = `tasks/${taskId}/add/${generatorId}`;
    await fetcherPost(actionKey, {});
    await mutate(getDisciplineTreeCollectionKey(disciplineId));
};

const createGeneration = async (taskId: number, data: { variants_count: number }) => {
    const actionKey = `tasks/${taskId}/new/generation`;
    await fetcherPost(actionKey, data);
    mutate(`tasks/${taskId}/results`);
};

// Edit actions
const editSection = async (disciplineId: number, sectionId: number, data: Partial<Section>) => {
    const actionKey = `edit/section/${sectionId}`;
    await fetcherPatch(actionKey, data);
    mutate(getDisciplineTreeCollectionKey(disciplineId));
};

const editTopic = async (disciplineId: number, topicId: number, data: Partial<Topic>) => {
    const actionKey = `edit/topic/${topicId}`;
    await fetcherPatch(actionKey, data);
    mutate(getDisciplineTreeCollectionKey(disciplineId));
};

const editGenerator = async (
    disciplineId: number,
    generatorId: number,
    data: Partial<Generator>,
) => {
    const actionKey = `edit/generator/${generatorId}`;
    await fetcherPatch(actionKey, data);
    mutate(getDisciplineTreeCollectionKey(disciplineId));
};

const editTask = async (disciplineId: number, taskId: number, data: any) => {
    const actionKey = `edit/task/${taskId}`;
    await fetcherPatch(actionKey, data);
    mutate(getDisciplineTreeCollectionKey(disciplineId));
};

const editResult = async (resultsId: number, data: Partial<GenerationResult>) => {
    const actionKey = `edit/results/${resultsId}`;
    await fetcherPatch(actionKey, data);
};

// Delete actions
const deleteGenerator = async (disciplineId: number, generatorId: number) => {
    const actionKey = `delete/generator/${generatorId}`;
    await fetcherDelete(actionKey);
    mutate(getDisciplineTreeCollectionKey(disciplineId));
};

const deleteTask = async (disciplineId: number, taskId: number) => {
    const actionKey = `delete/task/${taskId}`;
    await fetcherDelete(actionKey);
    mutate(getDisciplineTreeCollectionKey(disciplineId));
};

const deleteTaskGenerator = async (disciplineId: number, taskGeneratorId: number) => {
    const actionKey = `delete/task_generator/${taskGeneratorId}`;
    await fetcherDelete(actionKey);
    mutate(getDisciplineTreeCollectionKey(disciplineId));
};

const deleteTopic = async (disciplineId: number, topicId: number) => {
    const actionKey = `delete/topic/${topicId}`;
    await fetcherDelete(actionKey);
    mutate(getDisciplineTreeCollectionKey(disciplineId));
};

const deleteSection = async (disciplineId: number, sectionId: number) => {
    const actionKey = `delete/section/${sectionId}`;
    await fetcherDelete(actionKey);
    mutate(getDisciplineTreeCollectionKey(disciplineId));
};

const deleteResults = async (resultsId: number) => {
    const actionKey = `delete/results/${resultsId}`;
    await fetcherDelete(actionKey);
};

const apiActions = {
    create: {
        section: createSection,
        topic: createTopic,
        generator: createGenerator,
        task: createTask,
        taskGenerator: createTaskGenerator,
        generation: createGeneration,
    },
    edit: {
        section: editSection,
        topic: editTopic,
        generator: editGenerator,
        task: editTask,
        result: editResult,
    },
    delete: {
        section: deleteSection,
        topic: deleteTopic,
        generator: deleteGenerator,
        task: deleteTask,
        taskGenerator: deleteTaskGenerator,
        results: deleteResults,
    },
};

export { apiActions };
