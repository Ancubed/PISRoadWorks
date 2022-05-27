import Row from '../../components/common/row'

import aggregateExecutors from '../../lib/aggregation'

const matrixWeight = {
    done: 3,
    inProgress: 1.2,
    expired: -1.5,
}

const Indicators = ({ executors }) => {
    return (
        <main>
            <h1 className="text-2xl mb-4">Показатели выполнения работ</h1>
            {(!executors || executors.length == 0) 
            && 
            <span>
                Нет данных
            </span>}
            {executors && executors.length > 0
            && 
            <table className="w-full">
                <tbody>
                    <Row
                        companyName="Название"
                        total="Всего"
                        done="Выполнено"
                        inProgress="Выполняется"
                        expired="Просрочено"
                        grade="Оценка"
                        isHeader={true}
                    ></Row>
                    {executors.map((executor, key) => (
                        <Row
                            companyName={executor.companyName}
                            companyId={executor.id}
                            total={
                                executor.done +
                                    executor.inProgress +
                                    executor.expired
                            }
                            done={executor.done}
                            inProgress={executor.inProgress}
                            expired={executor.expired}
                            grade={executor.grade}
                            key={key}
                        ></Row>
                    ))}
                </tbody>
            </table>}
        </main>
    )
}

async function decisionMatrix(executors) {
    for (let i = 0; i < executors.length; i++) {
        const done = executors[i].done,
            inProgress = executors[i].inProgress,
            expired = executors[i].expired
        executors[i].grade =
            done * matrixWeight.done +
            inProgress * matrixWeight.inProgress +
            expired * matrixWeight.expired
    }
    return executors
}

async function gradeNormalize(executors) {
    let maxGrade = Math.max(...executors.map((exec) => exec.grade))
    for (let i = 0; i < executors.length; i++) {
        let grade = Math.ceil((executors[i].grade / maxGrade) * 100)
        executors[i].grade = grade > 0 ? grade : 0
    }
    return executors
}

async function sortByGrade(executors) {
    if (executors && executors.length != 0) {
        return executors.sort((prev, next) => {
            return next.grade - prev.grade
        })
    }
}

export async function getServerSideProps() {
    //let result = await aggregateExecutors(); // Результат аггрегации
    let result = await aggregateExecutors()
    if (result && result.length > 0) {
        const gradedExecutors = await decisionMatrix(result) // Подсчет решения
        const executors = await gradeNormalize(gradedExecutors) // Нормализация значений (от 0 до 100)
        result = await sortByGrade(executors) // Сортировка по оценке
    }
    return { props: { executors: result } }
}

export default Indicators
