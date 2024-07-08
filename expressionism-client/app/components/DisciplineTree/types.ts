export enum TreeNodeType {
    Section,
    Topic,
    Task,
    Generator,
    TaskDropPlaceholder
}

export interface Child {
    id: string;
    name: string;
    icon: React.ElementType;
    type: TreeNodeType;
    isAction?: boolean;
    action?: React.MouseEventHandler<HTMLElement>;
    extra?: React.ReactNode[];
    children?: Child[];
}

export enum TreeType {
    CourseStructure,
    ControlMaterials,
}
