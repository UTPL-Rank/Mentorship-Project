import { SGMAnalytics } from "@utpl-rank/sgm-helpers";

type AccompanimentEntry =
  | SGMAnalytics.LegacyAccompanimentEntry
  | SGMAnalytics.ProblemAccompanimentEntry
  | SGMAnalytics.NoProblemAccompanimentEntry;

type Labels =
  | 'Ninguno'
  | 'Académicos'
  | 'Administrativos'
  | 'Económicos'
  | 'Otros'
  | 'Phisosociales'
  | 'Conectividad';


export function GroupAccompanimentsProblems(accompaniments: Array<AccompanimentEntry>): Array<[string, number]> {
  const startVal: Record<Labels, number> = {
    'Ninguno': 0,
    'Académicos': 0,
    'Administrativos': 0,
    'Económicos': 0,
    'Otros': 0,
    'Phisosociales': 0,
    'Conectividad': 0,
  }

  const dataMap = accompaniments.reduce<Record<Labels, number>>(problemsReducer, startVal);

  const sorted = Object.entries(dataMap)
    .sort((a, b) => b[1] - a[1])
    .filter(entry => entry[1] > 0);

  return sorted;
}

function problemsReducer(res: Record<Labels, number>, accompaniment: AccompanimentEntry): Record<Labels, number> {

  // v1 accompaniments without problems
  if (accompaniment.kind === 'SGM#NO_PROBLEM_ACCOMPANIMENT') {
    res['Ninguno'] = res['Ninguno'] + 1;
  }

  // v2 accompaniments with problems
  else if (accompaniment.kind === 'SGM#PROBLEM_ACCOMPANIMENT') {
    if (accompaniment.problems.academic)
      res['Académicos'] = res['Académicos'] + 1;

    if (accompaniment.problems.administrative)
      res['Administrativos'] = res['Administrativos'] + 1;

    if (accompaniment.problems.economic)
      res['Económicos'] = res['Económicos'] + 1;

    if (accompaniment.problems.other)
      res['Otros'] = res['Otros'] + 1;

    if (accompaniment.problems.psychosocial)
      res['Phisosociales'] = res['Phisosociales'] + 1;

    //if (accompaniment.problems.connectivity)
      //  res['Conectividad'] = res['Conectividad'] + 1;
  }
  // legacy accompaniments without problems
  else {
    if (accompaniment.problems.none)
      res['Ninguno'] = res['Ninguno'] + 1;
    else if (accompaniment.problems.other)
      res['Otros'] = res['Otros'] + 1;
    else {
      if (accompaniment.problems.academic)
        res['Académicos'] = res['Académicos'] + 1;

      if (accompaniment.problems.administrative)
        res['Administrativos'] = res['Administrativos'] + 1;

      if (accompaniment.problems.economic)
        res['Económicos'] = res['Económicos'] + 1;

      if (accompaniment.problems.psychosocial)
        res['Phisosociales'] = res['Phisosociales'] + 1;

      //if (accompaniment.problems.connectivity)
        //res['Conectividad'] = res['Conectividad'] + 1;
    }

  }

  return res;
};
