import { ModalView } from "@slack/bolt";

const default_url = "https://example.com";
const default_width = "720";
const default_height = "480";

export function createModal(privateMetadata: any): ModalView {
    return {
        type: "modal",
        callback_id: "submit",
        private_metadata: privateMetadata,
        title: {
            type: "plain_text",
            text: "prtsc",
            emoji: true
        },
        submit: {
            type: "plain_text",
            text: "Submit",
            emoji: true
        },
        blocks: [
            {
                type: "input",
                block_id: "block_url",
                element: {
                    type: "plain_text_input",
                    action_id: "action_url",
                    initial_value: default_url
                },
                label: {
                    type: "plain_text",
                    text: "URL",
                    emoji: true
                }
            },
            {
                type: "input",
                block_id: "block_width",
                element: {
                    type: "plain_text_input",
                    action_id: "action_width",
                    initial_value: default_width
                },
                label: {
                    type: "plain_text",
                    text: "Width",
                    emoji: true
                }
            },
            {
                type: "input",
                block_id: "block_height",
                element: {
                    type: "plain_text_input",
                    action_id: "action_height",
                    initial_value: default_height
                },
                label: {
                    type: "plain_text",
                    text: "Height",
                    emoji: true
                }
            },
            {
                type: "section",
                block_id: "block_is_full_page",
                text: {
                    type: "plain_text",
                    text: " ",
                    emoji: true
                },
                accessory: {
                    type: "checkboxes",
                    options: [
                        {
                            text: {
                                type: "plain_text",
                                text: "Full page",
                                emoji: true
                            },
                            value: "is_full_page"
                        }
                    ],
                    action_id: "action_is_full_page"
                },
            }
        ]
    }
}