// all types are copied and adapted from types of '@notionhq/client'

export type ApiColor =
  | "default"
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "default_background"
  | "gray_background"
  | "brown_background"
  | "orange_background"
  | "yellow_background"
  | "green_background"
  | "blue_background"
  | "purple_background"
  | "pink_background"
  | "red_background";

export type SelectColor =
  | "default"
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red";

type InternalOrExternalFileWithNameRequest =
  | {
      file: {
        expiry_time?: string;
        url: string;
      };
      name: string;
      type: "file";
    }
  | {
      external: {
        url: string;
      };
      name: string;
      type: "external";
    };

type FileUploadstring = {
  id: string;
};
type FileUploadWithOptionalNameRequest = {
  file_upload: FileUploadstring;
  name?: string;
  type: "file_upload";
};
type RichTextItemRequestCommon = {
  annotations?: AnnotationRequest;
};
type AnnotationRequest = {
  bold?: boolean;
  code?: boolean;
  color?: ApiColor;
  italic?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
};

type TextRichTextItemRequest = {
  text: {
    content: string;
    link?: {
      url: string;
    } | null;
  };
  type: "text";
};
type TemplateMentionDateTemplateMentionRequest = {
  template_mention_date: "today" | "now";
  type: "template_mention_date";
};
type TemplateMentionUserTemplateMentionRequest = {
  template_mention_user: "me";
  type: "template_mention_user";
};
type TemplateMentionRequest =
  | TemplateMentionDateTemplateMentionRequest
  | TemplateMentionUserTemplateMentionRequest;

type MentionRichTextItemRequest = {
  mention:
    | {
        type: "user";
        user: {
          id: string;
          object: "user";
        };
      }
    | {
        date: {
          end?: string | null;
          start: string;
          time_zone?: string | null;
        };
        type: "date";
      }
    | {
        page: {
          id: string;
        };
        type: "page";
      }
    | {
        database: {
          id: string;
        };
        type: "database";
      }
    | {
        template_mention: TemplateMentionRequest;
        type: "template_mention";
      }
    | {
        custom_emoji: {
          id: string;
          name?: string;
          url?: string;
        };
        type: "custom_emoji";
      };
  type: "mention";
};
type EquationRichTextItemRequest = {
  equation: {
    expression: string;
  };
  type: "equation";
};

type RichTextItemRequest = RichTextItemRequestCommon &
  (
    | TextRichTextItemRequest
    | MentionRichTextItemRequest
    | EquationRichTextItemRequest
  );

type TitleValue = {
  title: Array<RichTextItemRequest>;
  type: "title";
};
type RichTextValue = {
  rich_text: Array<RichTextItemRequest>;
  type: "rich_text";
};

// Selection option types
type SelectionOption =
  | {
      color?: SelectColor;
      description?: string | null;
      id: string;
      name?: string;
    }
  | {
      color?: SelectColor;
      description?: string | null;
      id?: string;
      name: string;
    };

// Selection-based property types
type SelectValue = {
  select: SelectionOption | null;
  type: "select";
};

type MultiSelectValue = {
  multi_select: Array<SelectionOption>;
  type: "multi_select";
};

type StatusValue = {
  status: SelectionOption | null;
  type: "status";
};

// People-based property types
type PeopleValue = {
  people: Array<
    | {
        id: string;
        object: "user";
      }
    | {
        id: string;
        name?: string | null;
        object: "group";
      }
  >;
  type: "people";
};
type EmailValue = {
  email: string | null;
  type: "email";
};

type PhoneNumberValue = {
  phone_number: string | null;
  type: "phone_number";
};

// Date property types
type DateValue = {
  date: {
    end?: string | null;
    start: string;
    time_zone?: string | null;
  } | null;
  type: "date";
};

// Relation property types
type RelationValue = {
  relation: Array<{
    id: string;
  }>;
  type: "relation";
};

// File property types
type FilesValue = {
  files: Array<
    InternalOrExternalFileWithNameRequest | FileUploadWithOptionalNameRequest
  >;
  type: "files";
};

// Location property types
type LocationValue = {
  place: {
    address?: string | null;
    aws_place_id?: string | null;
    google_place_id?: string | null;
    lat: number;
    lon: number;
    name?: string | null;
  } | null;
  type: "place";
};

type numberValue = {
  number: number | null;
  type: "number";
};

type UrlValue = {
  type: "url";
  url: string | null;
};

type CheckboxValue = {
  checkbox: boolean;
  type: "checkbox";
};

export type PagePropertyValue =
  | TitleValue
  | RichTextValue
  | PeopleValue
  | EmailValue
  | PhoneNumberValue
  | DateValue
  | RelationValue
  | FilesValue
  | SelectValue
  | MultiSelectValue
  | StatusValue
  | LocationValue
  | numberValue
  | UrlValue
  | CheckboxValue;
