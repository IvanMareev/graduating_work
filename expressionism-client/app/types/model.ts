export type GenerationVariant = {
    id: number;
};

export type GenerationResult = {
    id: number;
    name: string;
    created_at: string;
    issued: boolean;
};

export type Generator = {
    id: number;
    topic_id: number;
    name: string;
    task_text: string;
    variables: string;
    coefficients: string;
    restricts: string;
    content: string;
};

export type TaskType = {
    id: number;
    name: string;
};

export type CourseVariant = {
    id: number;
    name: string;
};

export type TaskGenerator = {
    id: number;
    generator: Generator;
};

export type Task = {
    id: number;
    topic: { name: string };
    name: string;
    type: TaskType;
    course_variant: CourseVariant;
    generators: TaskGenerator[];
};

export type Topic = {
    id: number;
    name: string;
    generators: Generator[];
    tasks: Task[];
};

export type Section = {
    id: number;
    name: string;
    topics: Topic[];
};

export type Discipline = {
    sections: Section[];
};
