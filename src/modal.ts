import { ModalView } from "@slack/bolt";

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
                    action_id: "action_url"
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
                    action_id: "action_width"
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
                    action_id: "action_height"
                },
                label: {
                    type: "plain_text",
                    text: "Height",
                    emoji: true
                }
            }
        ]
    }
}