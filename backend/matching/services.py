from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from jobs.models import Job
from resumes.models import Resume
from .models import Match

def run_matching():
    jobs = Job.objects.all()
    resumes = Resume.objects.all()

    if not jobs.exists() or not resumes.exists():
        return

    job_texts = [job.description for job in jobs]
    resume_texts = [resume.content for resume in resumes]

    documents = job_texts + resume_texts

    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(documents)

    job_vectors = tfidf_matrix[:len(jobs)]
    resume_vectors = tfidf_matrix[len(jobs):]

    for i, job in enumerate(jobs):
        similarities = cosine_similarity(job_vectors[i], resume_vectors)

        for j, resume in enumerate(resumes):
            score = similarities[0][j]

            Match.objects.update_or_create(
                job=job,
                resume=resume,
                defaults={'score': score}
            )
