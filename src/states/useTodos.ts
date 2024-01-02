import { useQuery, NonEmptyString1000 } from '@evolu/react';
import {  evolu } from '@/states/evolu';

const query = evolu.createQuery((db) =>
  db
    .selectFrom('todo')
    .selectAll()
    .$narrowType<{ name: NonEmptyString1000 }>()
    .orderBy('createdAt'),
);

const useGoals = () => useQuery(query);

export default useGoals;
