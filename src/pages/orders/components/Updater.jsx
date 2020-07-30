import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { stateProps } from '../Orders'
import Chip from '../../../components/Chip'
import gql from 'graphql-tag'

const MARK_AS_DELIVERED_MUTATION = gql`
  mutation MarkAsDelivered($id: Int_comparison_exp = {}) {
    update_order(
      where: { id: $id }
      _set: { deliveredAt: "now()", state: "delivered" }
    ) {
      returning {
        id
        state
      }
    }
  }
`

const MARK_AS_PREPARED_MUTATION = gql`
  mutation MarkAsPrepared($id: Int_comparison_exp = {}) {
    update_order(
      where: { id: $id }
      _set: { preparedAt: "now()", state: "prepared" }
    ) {
      returning {
        id
        state
      }
    }
  }
`

const stateStrategies = {
  placed: MARK_AS_PREPARED_MUTATION,
  prepared: MARK_AS_DELIVERED_MUTATION,
}

const Updater = ({ currentState, id }) => {
  const [mutate, { loading, data, called }] = useMutation(
    stateStrategies[currentState] || MARK_AS_PREPARED_MUTATION,
  )
  const newState = data?.update_order.returning[0].state

  const handleChange = () => mutate({ variables: { id: { _eq: id } } })

  if (currentState === 'delivered') {
    return <Chip {...stateProps[currentState]} className="text-xl" />
  }

  if (called && newState && newState !== currentState) {
    return <Chip {...stateProps[newState]} className="text-xl" />
  }

  if (['placed', 'prepared'].includes(currentState)) {
    return (
      <button className="button" onClick={handleChange} disabled={loading}>
        {loading
          ? 'Actualizando...'
          : `Marcar ${
              currentState === 'placed'
                ? stateProps.prepared.label
                : stateProps.delivered.label
            }`}
      </button>
    )
  }
}

export default Updater
