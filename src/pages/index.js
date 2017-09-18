import React from 'react'
import Link from 'next/link'
import UuidV1 from 'uuid/v1'
import Layout from '../components/Layout'

export default class extends React.Component {
    static async getInitialProps({req}) {
        const uuid = UuidV1();
        return {uuid}
    }

    render() {
        return (
            <Layout>
                <div>UUID = {this.props.uuid}</div>
                <ul>
                    <li>
                        <Link href={{ pathname: '/login', query: { uuid: this.props.uuid } }}>
                            <a>Start Username / Password interaction</a>
                        </Link>
                    </li>
                </ul>
            </Layout>
        )
    }
}
